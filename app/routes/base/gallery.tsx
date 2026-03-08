import { useOutletContext } from "react-router";
import type { Route } from "./+types/gallery";
import type { User, AiTask } from "~/.server/libs/db";
import { listAiTasksByUser } from "~/.server/model/ai_tasks";
import { getSessionHandler } from "~/.server/libs/session";
import { redirect } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const [session] = await getSessionHandler(request);
    const user = session.get("user");
    if (!user) throw redirect("/?login=true");

    let tasks: AiTask[] = [];
    try {
        const response = await listAiTasksByUser(user.id, 1, 50);
        tasks = response.data;
    } catch (err) {
        console.error(err);
    }

    return { tasks };
};

export default function GalleryPage({ loaderData }: Route.ComponentProps) {
    const { user } = useOutletContext<{ user: User }>();
    const { tasks } = loaderData;

    const successfulTasks = tasks?.filter(t => t.status === "succeeded" && t.result_url) || [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>
                <p className="text-base-content/70 mt-1">Your past AI generated images.</p>
            </div>

            <div className="bg-base-100 p-6 rounded-xl border border-base-200 min-h-[400px]">
                {successfulTasks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {successfulTasks.map((task: any) => (
                            <div key={task.id} className="aspect-square rounded-lg overflow-hidden border border-base-200 shadow-sm relative group">
                                <img
                                    src={task.result_url}
                                    alt="Generated content"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white text-xs truncate">
                                        {task.input_params ? JSON.parse(task.input_params as string).prompt : "No prompt"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-3xl">
                            🎨
                        </div>
                        <h3 className="font-medium text-lg mb-1">No images yet</h3>
                        <p className="text-base-content/60 max-w-sm mb-6">
                            You haven't generated any images. Head over to the generator to create your first masterpiece!
                        </p>
                        <a href="/" className="btn btn-primary">
                            Go to Generator
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
