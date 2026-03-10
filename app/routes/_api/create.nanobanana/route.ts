import type { Route } from "./+types/route";
import { data } from "react-router";

import { z } from "zod";
import { getSessionHandler } from "~/.server/libs/session";
import { createNanoBananaTask } from "~/.server/services/ai-tasks";

// 构造请求参数校验实体
const createNanoBananaSchema = z.object({
    photo: z.instanceof(File),
    prompt: z.string().min(1, "Prompt cannot be empty"),
    detail: z.string().optional(),
});

export const action = async ({ request }: Route.ActionArgs) => {
    if (request.method.toLowerCase() !== "post") {
        throw new Response("Not Found", { status: 404 });
    }

    const form = await request.formData();
    const photo = form.get("photo");
    const prompt = form.get("prompt");
    const detail = form.get("detail");

    console.log("FormData received:", {
        photo: photo instanceof File ? photo.name : photo,
        prompt,
        detail,
    });

    const parsed = createNanoBananaSchema.safeParse({
        photo,
        prompt: typeof prompt === "string" ? prompt.trim() : "",
        detail: typeof detail === "string" && detail.trim() ? detail : undefined,
    });

    if (!parsed.success) {
        const message =
            parsed.error.issues[0]?.message ?? "Invalid request payload";
        throw new Response(message, { status: 400 });
    }

    const json = parsed.data;

    const [session] = await getSessionHandler(request);
    const user = session.get("user");
    if (!user) throw new Response("Unauthorized", { status: 401 });

    try {
        const result = await createNanoBananaTask(json, user);
        return data(result);
    } catch (e) {
        console.error("Create nanobanana task error");
        console.error(e);
        const errorMessage =
            e instanceof Error
                ? e.message
                : typeof e === "object" &&
                    e !== null &&
                    "message" in e &&
                    typeof e.message === "string"
                    ? e.message
                    : String(e);
        const status = errorMessage === "Credits Insufficient" ? 402 : 500;
        throw new Response(errorMessage, { status });
    }
};

export type CreateNanoBananaResult = Awaited<ReturnType<typeof action>>["data"];
