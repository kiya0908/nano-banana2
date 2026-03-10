import { env } from "cloudflare:workers";

import { nanoid } from "nanoid";
import currency from "currency.js";

import type { CreateAiHairstyleDTO } from "~/.server/schema/task";

import {
  insertAiTaskBatch,
  getAiTaskByTaskNo,
  updateAiTask,
  getAiTaskByTaskId,
} from "~/.server/model/ai_tasks";
import type { InsertAiTask, AiTask, User } from "~/.server/libs/db";
import { consumptionsCredits } from "./credits";
import { uploadFiles, downloadFilesToBucket } from "./r2-bucket";
import {
  KieAI,
  type CreateKontextOptions,
  type Create4oTaskOptions,
  type CreateNanoBananaOptions,
} from "~/.server/aisdk";

import { createAiHairstyleChangerPrompt } from "~/.server/prompt/ai-hairstyle";
import { createAiHairstyleChangerPrompt as createHairstyleChangerKontext } from "~/.server/prompt/ai-hairstyle-kontext";
import { NANO_BANANA_TASK_CREDITS } from "~/constants/tasks";

export type AiTaskResult = Pick<
  AiTask,
  | "task_no"
  | "task_id"
  | "created_at"
  | "status"
  | "completed_at"
  | "aspect"
  | "result_url"
  | "fail_reason"
  | "ext"
>;
const transformResult = (value: AiTask): AiTaskResult => {
  const {
    task_no,
    task_id,
    created_at,
    status,
    completed_at,
    aspect,
    result_url,
    fail_reason,
    ext,
  } = value;

  return {
    task_no,
    task_id,
    created_at,
    status,
    completed_at,
    aspect,
    result_url,
    fail_reason,
    ext,
  };
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message
  ) {
    return error.message;
  }

  return String(error);
};

export const createAiTask = async (payload: InsertAiTask | InsertAiTask[]) => {
  const values = Array.isArray(payload) ? Array.from(payload) : [payload];
  const results = await insertAiTaskBatch(values);

  return results.map(transformResult);
};

export const createAiHairstyle = async (
  value: CreateAiHairstyleDTO,
  user: User
) => {
  const { photo, hair_color, hairstyle, detail, type } = value;

  const taskCredits = hairstyle.length;

  // 进行 Credits 扣除
  const consumptionResult = await consumptionsCredits(user, {
    credits: taskCredits,
  });

  const extName = photo.name.split(".").pop()!;
  const newFileName = `${nanoid()}.${extName}`;
  const file = new File([photo], newFileName);
  const [R2Object] = await uploadFiles(file);

  const fileUrl = new URL(R2Object.key, env.CDN_URL).toString();

  let insertPayloads: InsertAiTask[] = [];
  if (type === "gpt-4o") {
    const aspect = "2:3";
    const callbakUrl = new URL("/webhooks/kie-image", env.DOMAIN).toString();

    insertPayloads = hairstyle.map<InsertAiTask>((style) => {
      const inputParams = {
        photo: fileUrl,
        hair_color,
        hairstyle: style,
        detail,
      };
      const ext = {
        hairstyle: style.name,
        haircolor: hair_color.value ? hair_color.name : undefined,
      };

      const filesUrl = [fileUrl];
      if (style.cover) filesUrl.push(style.cover);
      if (hair_color.cover) filesUrl.push(hair_color.cover);

      const params: Create4oTaskOptions = {
        filesUrl: filesUrl,
        prompt: createAiHairstyleChangerPrompt({
          hairstyle: style.name,
          haircolor: hair_color.name,
          haircolorHex: hair_color.value,
          withStyleReference: !!style.cover,
          withColorReference: !!hair_color.cover,
          detail: detail,
        }),
        size: aspect,
        nVariants: "4",
        callBackUrl: import.meta.env.PROD ? callbakUrl : undefined,
      };

      return {
        user_id: user.id,
        status: "pending",
        estimated_start_at: new Date(),
        input_params: inputParams,
        ext,
        aspect: aspect,
        provider: "kie_4o",
        request_param: params,
      };
    });
  } else if (type === "kontext") {
    const aspect = "3:4";
    const callbakUrl = new URL("/webhooks/kie-image", env.DOMAIN).toString();

    insertPayloads = hairstyle.map<InsertAiTask>((style) => {
      const inputParams = {
        photo: fileUrl,
        hair_color,
        hairstyle: style,
        detail,
      };
      const ext = {
        hairstyle: style.name,
        haircolor: hair_color.value ? hair_color.name : undefined,
      };

      const filesUrl = [fileUrl];
      if (style.cover) filesUrl.push(style.cover);
      if (hair_color.cover) filesUrl.push(hair_color.cover);

      const params: CreateKontextOptions = {
        inputImage: fileUrl,
        prompt: createHairstyleChangerKontext({
          hairstyle: style.name,
          haircolor: hair_color.name,
          detail: detail,
        }),
        aspectRatio: aspect,
        model: "flux-kontext-pro",
        outputFormat: "png",
        callBackUrl: import.meta.env.PROD ? callbakUrl : undefined,
      };

      return {
        user_id: user.id,
        status: "pending",
        estimated_start_at: new Date(),
        input_params: inputParams,
        ext,
        aspect: aspect,
        provider: "kie_kontext",
        request_param: params,
      };
    });
  }

  const tasks = await createAiTask(insertPayloads);
  return { tasks, consumptionCredits: consumptionResult };
};

export const createNanoBananaTask = async (
  value: { photo: File; prompt: string; detail?: string },
  user: User
) => {
  const { photo, prompt, detail } = value;

  // 扣减积分，这里先固定为 200
  const taskCredits = NANO_BANANA_TASK_CREDITS;
  const consumptionResult = await consumptionsCredits(user, {
    credits: taskCredits,
  });

  const extName = photo.name.split(".").pop()!;
  const newFileName = `${nanoid()}.${extName}`;
  const file = new File([photo], newFileName);
  const [R2Object] = await uploadFiles(file);

  const fileUrl = new URL(R2Object.key, env.CDN_URL).toString();

  const aspect = "1:1";
  const callbakUrl = new URL("/webhooks/kie-image", env.DOMAIN).toString();

  const inputParams = {
    prompt: prompt,
    image_url: fileUrl,
    detail,
  };

  const ext = {
    mode: "default",
    style: "default",
  };

  const params: CreateNanoBananaOptions = {
    inputImage: fileUrl,
    prompt: prompt,
    aspectRatio: aspect,
    outputFormat: "png",
    callBackUrl: import.meta.env.PROD ? callbakUrl : undefined,
  };

  const insertPayload: InsertAiTask = {
    user_id: user.id,
    status: "pending",
    estimated_start_at: new Date(),
    input_params: inputParams,
    ext,
    aspect: aspect,
    provider: "nanobanana_2",
    request_param: params,
  };

  const tasks = await createAiTask(insertPayload);
  return { tasks, consumptionCredits: consumptionResult };
};

export const startTask = async (params: AiTask["task_no"] | AiTask) => {
  let task: AiTask;
  if (typeof params === "string") {
    const result = await getAiTaskByTaskNo(params);
    if (!result) throw Error("Unvalid Task No");
    task = result;
  } else task = params;

  if (task.status !== "pending") {
    throw Error("Task is not in Pending");
  }

  const startAt = task.estimated_start_at.valueOf();
  if (startAt > new Date().valueOf()) {
    throw Error("Not Allow to Start");
  }

  const kie = new KieAI();
  let newTask: AiTask;
  if (task.provider === "kie_4o") {
    const result = await kie.create4oTask(
      task.request_param as Create4oTaskOptions
    );
    const res = await updateAiTask(task.task_no, {
      task_id: result.taskId,
      status: "running",
      started_at: new Date(),
    });
    newTask = res[0];
  } else if (task.provider === "kie_kontext") {
    const result = await kie.createKontextTask(
      task.request_param as CreateKontextOptions
    );
    const res = await updateAiTask(task.task_no, {
      task_id: result.taskId,
      status: "running",
      started_at: new Date(),
    });
    newTask = res[0];
  } else if (task.provider === "nanobanana_2") {
    const result = await kie.createNanoBananaTask(
      task.request_param as CreateNanoBananaOptions
    );
    const res = await updateAiTask(task.task_no, {
      task_id: result.taskId,
      status: "running",
      started_at: new Date(),
    });
    newTask = res[0];
  } else {
    throw Error("Unvalid Task Provider");
  }

  return transformResult(newTask);
};

/**
 * 更新生成任务的状态，依据 status 处理
 * - pending: 尝试 startTask
 * - running: 尝试更新 task detail
 * - 其他值: 返回处理后的 task 内容
 */
export const updateTaskStatus = async (taskNo: AiTask["task_no"] | AiTask) => {
  let task: AiTask | undefined | null;
  if (typeof taskNo === "string") {
    task = await getAiTaskByTaskNo(taskNo);
  } else task = taskNo;

  if (!task) throw Error("Unvalid Task No");
  if (task.status === "pending") {
    try {
      const result = await startTask(task);
      return {
        task: result,
        progress: 0,
      };
    } catch (error) {
      const message = getErrorMessage(error);

      // Scheduling/race related errors can be retried on next polling tick.
      if (
        message === "Not Allow to Start" ||
        message === "Task is not in Pending"
      ) {
        const latestTask = await getAiTaskByTaskNo(task.task_no);
        return { task: transformResult(latestTask ?? task), progress: 0 };
      }

      console.error("Start task error");
      console.error(error);

      const [failedTask] = await updateAiTask(task.task_no, {
        status: "failed",
        completed_at: new Date(),
        fail_reason: message,
      });
      return { task: transformResult(failedTask ?? task), progress: 1 };
    }
  }
  if (task.status !== "running") {
    return {
      task: transformResult(task),
      progress: 1,
    };
  }

  if (!task.task_id) throw Error("Unvalid Task ID");

  const kie = new KieAI();

  if (task.provider === "kie_4o") {
    const result = await kie.query4oTaskDetail({ taskId: task.task_id });
    if (result.status === "GENERATING") {
      return {
        task: transformResult(task),
        progress: currency(result.progress).intValue,
      };
    } else if (result.status === "SUCCESS") {
      let resultUrl = result.response?.resultUrls[0];
      let newTask: AiTask;
      if (!resultUrl) {
        const [aiTask] = await updateAiTask(task.task_no, {
          status: "failed",
          completed_at: new Date(),
          result_data: result,
          result_url: resultUrl,
          fail_reason: "Result url not retrieved",
        });
        newTask = aiTask;
      } else {
        if (import.meta.env.PROD) {
          try {
            const [file] = await downloadFilesToBucket(
              [{ src: resultUrl, fileName: task.task_no, ext: "png" }],
              "result/hairstyle"
            );
            if (file) resultUrl = new URL(file.key, env.CDN_URL).toString();
          } catch { }
        }

        const [aiTask] = await updateAiTask(task.task_no, {
          status: "succeeded",
          completed_at: new Date(),
          result_data: result,
          result_url: resultUrl,
        });
        newTask = aiTask;
      }

      return { task: transformResult(newTask), progress: 1 };
    } else {
      const [newTask] = await updateAiTask(task.task_no, {
        status: "failed",
        completed_at: new Date(),
        fail_reason: result.errorMessage,
        result_data: result,
      });

      return { task: transformResult(newTask), progress: 1 };
    }
  } else if (task.provider === "kie_kontext") {
    const result = await kie.queryKontextTask({ taskId: task.task_id });
    if (result.successFlag === 0) {
      return {
        task: transformResult(task),
        progress: 0,
      };
    } else if (result.successFlag === 1) {
      let resultUrl =
        result.response?.resultImageUrl ?? result.response?.originImageUrl;
      let newTask: AiTask;
      if (!resultUrl) {
        const [aiTask] = await updateAiTask(task.task_no, {
          status: "failed",
          completed_at: new Date(),
          result_data: result,
          result_url: resultUrl,
          fail_reason: "Result url not retrieved",
        });
        newTask = aiTask;
      } else {
        if (import.meta.env.PROD) {
          try {
            const [file] = await downloadFilesToBucket(
              [{ src: resultUrl, fileName: task.task_no, ext: "png" }],
              "result/hairstyle"
            );
            if (file) resultUrl = new URL(file.key, env.CDN_URL).toString();
          } catch { }
        }

        const [aiTask] = await updateAiTask(task.task_no, {
          status: "succeeded",
          completed_at: new Date(),
          result_data: result,
          result_url: resultUrl,
        });
        newTask = aiTask;
      }

      return { task: transformResult(newTask), progress: 1 };
    } else {
      const [newTask] = await updateAiTask(task.task_no, {
        status: "failed",
        completed_at: new Date(),
        fail_reason: result.errorMessage,
        result_data: result,
      });

      return { task: transformResult(newTask), progress: 1 };
    }
  } else if (task.provider === "nanobanana_2") {
    const result = await kie.queryNanoBananaTask({ taskId: task.task_id });

    if (result.status === "PENDING" || result.status === "GENERATING") {
      return {
        task: transformResult(task),
        progress: result.progress ?? 0,
      };
    } else if (result.status === "SUCCESS") {
      let resultUrl =
        result.response?.resultImageUrl ?? result.response?.originImageUrl;
      let newTask: AiTask;

      if (!resultUrl) {
        const [aiTask] = await updateAiTask(task.task_no, {
          status: "failed",
          completed_at: new Date(),
          result_data: result,
          result_url: resultUrl,
          fail_reason: "Result url not retrieved from Nano Banana 2",
        });
        newTask = aiTask;
      } else {
        if (import.meta.env.PROD) {
          try {
            const [file] = await downloadFilesToBucket(
              [{ src: resultUrl, fileName: task.task_no, ext: "png" }],
              "result/nanobanana"
            );
            if (file) resultUrl = new URL(file.key, env.CDN_URL).toString();
          } catch { }
        }

        const [aiTask] = await updateAiTask(task.task_no, {
          status: "succeeded",
          completed_at: new Date(),
          result_data: result,
          result_url: resultUrl,
        });
        newTask = aiTask;
      }

      return { task: transformResult(newTask), progress: 1 };
    } else {
      const [newTask] = await updateAiTask(task.task_no, {
        status: "failed",
        completed_at: new Date(),
        fail_reason: result.errorMessage ?? "Unknown Error",
        result_data: result,
      });

      return { task: transformResult(newTask), progress: 1 };
    }
  }

  return {
    task: transformResult(task),
    progress: 1,
  };
};

export const updateTaskStatusByTaskId = async (taskId: AiTask["task_id"]) => {
  const result = await getAiTaskByTaskId(taskId);
  if (!result || result.status !== "running") {
    throw Error("Unvalid Task ID");
  }

  await updateTaskStatus(result);
};
