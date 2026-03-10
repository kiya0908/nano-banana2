import type { Route } from "./+types/route";
import { data } from "react-router";

import { z } from "zod";
import { getSessionHandler } from "~/.server/libs/session";
import { createNanoBananaTask } from "~/.server/services/ai-tasks";

const MAX_IMAGE_COUNT = 14;
const MAX_IMAGE_SIZE_BYTES = 30 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const ASPECT_RATIO_OPTIONS = [
  "1:1",
  "1:4",
  "1:8",
  "2:3",
  "3:2",
  "3:4",
  "4:1",
  "4:3",
  "4:5",
  "5:4",
  "8:1",
  "9:16",
  "16:9",
  "21:9",
  "auto",
] as const;

const imageSchema = z.instanceof(File).superRefine((file, ctx) => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Unsupported image type. Use JPG, PNG, or WEBP.",
    });
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Each image must be 30MB or smaller.",
    });
  }
});

const createNanoBananaSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt cannot be empty"),
  images: z
    .array(imageSchema)
    .max(MAX_IMAGE_COUNT, `You can upload up to ${MAX_IMAGE_COUNT} images.`)
    .default([]),
  aspect_ratio: z.enum(ASPECT_RATIO_OPTIONS).default("auto"),
  resolution: z.enum(["1K", "2K", "4K"]).default("1K"),
  output_format: z.enum(["jpg", "png"]).default("jpg"),
  google_search: z.boolean().default(false),
  detail: z.string().optional(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method.toLowerCase() !== "post") {
    throw new Response("Not Found", { status: 404 });
  }

  const form = await request.formData();
  const prompt = form.get("prompt");
  const aspectRatio = form.get("aspect_ratio");
  const resolution = form.get("resolution");
  const outputFormat = form.get("output_format");
  const googleSearch = form.get("google_search");
  const detail = form.get("detail");

  const imageCandidates = [...form.getAll("images"), form.get("photo")].filter(
    (entry): entry is File => entry instanceof File && entry.size > 0
  );

  const parsed = createNanoBananaSchema.safeParse({
    prompt: typeof prompt === "string" ? prompt : "",
    images: imageCandidates,
    aspect_ratio: typeof aspectRatio === "string" ? aspectRatio : undefined,
    resolution: typeof resolution === "string" ? resolution : undefined,
    output_format:
      typeof outputFormat === "string" ? outputFormat.toLowerCase() : undefined,
    google_search:
      typeof googleSearch === "string"
        ? ["1", "true", "yes", "on"].includes(googleSearch.toLowerCase())
        : false,
    detail: typeof detail === "string" && detail.trim() ? detail : undefined,
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request payload";
    throw new Response(message, { status: 400 });
  }

  const [session] = await getSessionHandler(request);
  const user = session.get("user");
  if (!user) throw new Response("Unauthorized", { status: 401 });

  try {
    const result = await createNanoBananaTask(parsed.data, user);
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
