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
    const raw = Object.fromEntries(form.entries());

    // Zod 参数校验
    const json = createNanoBananaSchema.parse(raw);

    const [session] = await getSessionHandler(request);
    const user = session.get("user");
    if (!user) throw new Response("Unauthorized", { status: 401 });

    try {
        const result = await createNanoBananaTask(json, user);
        return data(result);
    } catch (e) {
        console.error("Create nanobanana task error");
        console.error(e);
        throw new Response("Server Error", { status: 500 });
    }
};

export type CreateNanoBananaResult = Awaited<ReturnType<typeof action>>["data"];
