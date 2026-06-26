import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../services/productsApi";
import ProfileSkeleton from "../components/ui/ProfileSkeleton";

function ProfilePage() {
  const user = useSelector((state) => state.auth.user);

  // Query user by ID and configure polling interval of 15 seconds (15000 ms)
  const {
    data: profileData,
    isLoading,
    error,
  } = useGetUserByIdQuery(user?.id, {
    pollingInterval: 15000,
    skip: !user?.id,
  });

  if (isLoading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 dark:text-red-400 font-medium">
        ⚠️ Error loading user profile.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal account credentials and role info.
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm space-y-6">
        <div className="flex items-center gap-6">
          {profileData?.avatar ? (
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-24 h-24 rounded-full object-cover border border-gray-200 dark:border-slate-600 shadow-sm bg-gray-50"
              loading="lazy"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-3xl font-bold">
              {profileData?.name ? profileData.name.charAt(0) : "U"}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {profileData?.name || "N/A"}
            </h2>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 capitalize">
              🔑 {profileData?.role || "user"}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-700 pt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">
              {profileData?.email || "N/A"}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              User ID
            </label>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">
              #{profileData?.id || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;