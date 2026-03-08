import { useOutletContext } from "react-router";
import type { User } from "~/.server/libs/db";

export default function Profile() {
    const { user } = useOutletContext<{ user: User }>();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
                <p className="text-base-content/70 mt-1">Manage your personal information.</p>
            </div>

            <div className="bg-base-100 p-6 rounded-xl border border-base-200">
                <div className="flex items-center space-x-6">
                    <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={user.avatar_url || "https://api.dicebear.com/7.x/notionists/svg?seed=Felix"} alt="Avatar" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">{user.nickname}</h3>
                        <p className="text-base-content/60">{user.email}</p>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-4 max-w-md">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Email Address</span>
                        </label>
                        <input
                            type="text"
                            value={user.email}
                            disabled
                            className="input input-bordered w-full"
                        />
                        <label className="label">
                            <span className="label-text-alt text-base-content/60">Email cannot be changed if registered via external provider.</span>
                        </label>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Nickname</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={user.nickname || ""}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <button className="btn btn-primary mt-4">Save Changes</button>
                </div>
            </div>
        </div>
    );
}
