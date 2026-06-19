import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useState } from "react";
import ImageCropper from "../components/ImageCropper.jsx";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageToCrop(reader.result);
      // Reset input value so same file can be selected again
      e.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const handleCropSave = async (croppedBase64) => {
    setImageToCrop(null);
    setSelectedImage(croppedBase64);
    const success = await updateProfile({ profilePic: croppedBase64 });
    if (!success) setSelectedImage(null);
  };

  const handleCropCancel = () => {
    setImageToCrop(null);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-base-content/70">
              Your profile information
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {selectedImage || authUser?.profilePic ? (
                <img
                  src={selectedImage || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
              ) : (
                <img
                  src="/avatar.png"
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
              )}
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full bg-base-content text-base-200 transition-all duration-200 hover:scale-105 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="size-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <User className="size-4" />
                Full Name
              </div>
              <p className="rounded-lg border border-base-300 bg-base-200 px-4 py-2.5 capitalize">
                {authUser?.name}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="size-4" />
                Email Address
              </div>
              <p className="rounded-lg border border-base-300 bg-base-200 px-4 py-2.5">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-base-300 p-6">
            <h2 className="mb-4 text-lg font-medium">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-zinc-700 py-2">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCrop={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default Profile;
