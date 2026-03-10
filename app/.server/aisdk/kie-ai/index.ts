import { env } from "cloudflare:workers";

import type {
  ApiResult,
  Create4oTaskOptions,
  GPT4oTaskCallbackJSON,
  GPT4oTask,
} from "./type";
import type { CreateKontextOptions, KontextTask } from "./type";

// Create GPT 4o Options
export type { Create4oTaskOptions, GPT4oTask, GPT4oTaskCallbackJSON };

// Create Kontext Options
export type { CreateKontextOptions, KontextTask };

export interface CreateNanoBananaOptions {
  inputImage?: string;
  prompt: string;
  aspectRatio?: string;
  outputFormat?: "jpg" | "png";
  resolution?: "1K" | "2K" | "4K";
  googleSearch?: boolean;
  callBackUrl?: string;
  [key: string]: any;
}

export interface NanoBananaTask {
  taskId: string;
  status: "PENDING" | "GENERATING" | "SUCCESS" | "FAILED";
  progress?: number;
  response?: {
    resultImageUrl?: string;
    originImageUrl?: string;
    [key: string]: any;
  };
  errorMessage?: string;
}

interface KieAIModelConfig {
  accessKey: string;
  baseUrl: string;
}

interface CreateTaskResult {
  taskId: string;
}

interface QueryTaskParams {
  taskId: string;
}

interface MarketTaskDetail {
  taskId: string;
  state: string;
  resultJson?: string;
  failMsg?: string;
  progress?: number;
}

interface Get4oDirectDownloadURLOptions {
  taskId: string;
  url: string;
}

export class KieAI {
  private readonly API_URL: URL;
  private readonly config: KieAIModelConfig;

  constructor(config?: Partial<KieAIModelConfig>) {
    const envVars = env as unknown as Record<string, string | undefined>;
    const baseUrl =
      config?.baseUrl ?? envVars.KIEAI_BASE_URL ?? "https://api.kie.ai";

    this.API_URL = new URL(baseUrl);
    this.config = {
      accessKey: config?.accessKey ?? env.KIEAI_APIKEY,
      baseUrl: this.API_URL.toString(),
    };
  }

  private async fetch<T = any>(
    path: string,
    data?: Record<string, any>,
    init: RequestInit = {}
  ) {
    if (!this.config.accessKey) {
      throw Error("KIEAI_APIKEY is not configured");
    }

    const { headers, method = "get", ...rest } = init;

    const url = new URL(path, this.API_URL);
    const options: RequestInit = {
      ...rest,
      method,
      headers: {
        "content-type": "application/json",
        ...headers,
        Authorization: `Bearer ${this.config.accessKey}`,
      },
    };

    if (data) {
      if (method.toLowerCase() === "get") {
        Object.entries(data).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
      } else {
        options.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url, options);
    const responseText = await response.text();

    let json: ApiResult<T> | null = null;
    if (responseText) {
      try {
        json = JSON.parse(responseText) as ApiResult<T>;
      } catch {
        // Keep original response text for downstream error diagnosis.
      }
    }

    if (!response.ok) {
      throw {
        code: json?.code ?? response.status,
        message:
          (json?.msg && json.msg.trim()) ||
          responseText ||
          response.statusText ||
          "Request failed",
        data: json?.data ?? (responseText || null),
      };
    }

    if (!json) {
      throw {
        code: response.status,
        message: "Invalid JSON response from KieAI",
        data: responseText || null,
      };
    }

    if (json.code !== 200) {
      throw {
        code: json.code ?? response.status,
        message: json.msg ?? response.statusText,
        data: json.data ?? null,
      };
    }

    return json;
  }

  async create4oTask(payload: Create4oTaskOptions) {
    const result = await this.fetch<CreateTaskResult>(
      "/api/v1/gpt4o-image/generate",
      payload,
      {
        method: "post",
      }
    );

    return result.data;
  }

  async query4oTaskDetail(params: QueryTaskParams) {
    const result = await this.fetch<GPT4oTask>(
      "/api/v1/gpt4o-image/record-info",
      params
    );

    return result.data;
  }

  async get4oDownloadURL(params: Get4oDirectDownloadURLOptions) {
    console.log("params", params);

    const result = await this.fetch<string>(
      "/api/v1/gpt4o-image/download-url",
      params,
      { method: "post" }
    );
    console.log("result", result);

    return result.data;
  }

  async getCreditsRemaining() {
    const result = await this.fetch<number>("/api/v1/chat/credit");

    return result.data;
  }

  async createKontextTask(payload: CreateKontextOptions) {
    const result = await this.fetch<CreateTaskResult>(
      "/api/v1/flux/kontext/generate",
      payload,
      {
        method: "post",
      }
    );

    return result.data;
  }

  async queryKontextTask(params: QueryTaskParams) {
    const result = await this.fetch<KontextTask>(
      "/api/v1/flux/kontext/record-info",
      params
    );

    return result.data;
  }

  async createNanoBananaTask(payload: CreateNanoBananaOptions) {
    const requestBody = {
      model: "nano-banana-2",
      callBackUrl: payload.callBackUrl,
      input: {
        prompt: payload.prompt,
        aspect_ratio: payload.aspectRatio ?? "auto",
        resolution: payload.resolution ?? "1K",
        output_format: payload.outputFormat ?? "jpg",
        google_search: payload.googleSearch ?? false,
        image_input: payload.inputImage ? [payload.inputImage] : [],
      },
    };

    const result = await this.fetch<CreateTaskResult>(
      "/api/v1/jobs/createTask",
      requestBody,
      {
        method: "post",
      }
    );

    return result.data;
  }

  async queryNanoBananaTask(params: QueryTaskParams) {
    const result = await this.fetch<MarketTaskDetail>(
      "/api/v1/jobs/recordInfo",
      params
    );

    let response: NanoBananaTask["response"];
    const resultJson = result.data.resultJson;
    if (resultJson) {
      try {
        const parsed = JSON.parse(resultJson) as {
          resultUrls?: string[];
          resultObject?: Record<string, unknown>;
        };
        const firstUrl =
          parsed.resultUrls?.[0] ??
          (Array.isArray(parsed.resultObject?.resultUrls)
            ? (parsed.resultObject.resultUrls[0] as string | undefined)
            : undefined);

        if (firstUrl) {
          response = {
            resultImageUrl: firstUrl,
            originImageUrl: firstUrl,
          };
        }
      } catch {
        // Ignore malformed result JSON and let caller handle missing URL.
      }
    }

    const state = result.data.state.toLowerCase();
    const status: NanoBananaTask["status"] =
      state === "success"
        ? "SUCCESS"
        : state === "fail"
          ? "FAILED"
          : state === "generating"
            ? "GENERATING"
            : "PENDING";

    return {
      taskId: result.data.taskId,
      status,
      progress: result.data.progress,
      response,
      errorMessage: result.data.failMsg,
    };
  }
}
