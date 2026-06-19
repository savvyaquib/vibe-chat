import { Camera, Mail, User, Pencil, Check, X, Loader2, Calendar, Shield } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useState, useEffect } from "react";
import ImageCropper from "../components/ImageCropper.jsx";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState("");

  // Sync newName state with authUser when component mounts or authUser changes
  useEffect(() => {
    if (authUser?.name) {
      setNewName(authUser.name);
    }
  }, [authUser]);

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

  const handleEditClick = () => {
    setNewName(authUser?.name || "");
    setNameError("");
    setIsEditingName(true);
  };

  const handleCancelClick = () => {
    setIsEditingName(false);
    setNewName(authUser?.name || "");
    setNameError("");
  };

  const handleSaveClick = async () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setNameError("Name cannot be empty");
      return;
    }
    if (trimmedName.length < 2) {
      setNameError("Name must be at least 2 characters long");
      return;
    }

    if (trimmedName.toLowerCase() === authUser?.name?.toLowerCase()) {
      setIsEditingName(false);
      return;
    }

    const success = await updateProfile({ name: trimmedName });
    if (success) {
      setIsEditingName(false);
      setNameError("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveClick();
    } else if (e.key === "Escape") {
      handleCancelClick();
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-base-200/50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300/60 overflow-hidden transition-all duration-300">
          
          {/* Cover Header Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/30 via-secondary/25 to-accent/30 relative">
            <div className="absolute inset-0 bg-base-content/5 backdrop-blur-[2px]" />
          </div>

          <div className="px-6 pb-8 pt-0 flex flex-col items-center relative">
            
            {/* Avatar Section (Offset overlapping the cover banner) */}
            <div className="-mt-16 mb-4 relative group">
              <div className="size-32 rounded-full ring-4 ring-base-100 bg-base-200 overflow-hidden shadow-lg relative">
                {selectedImage || authUser?.profilePic ? (
                  <img
                    src={selectedImage || authUser.profilePic}
                    alt="Profile"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src="/avatar.png"
                    alt="Profile"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Upload Overlay Button */}
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-1 right-1 flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-content hover:bg-primary-focus transition-all duration-200 hover:scale-110 shadow-md ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="size-4" />
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

            {/* Profile Title & Subtitle */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-base-content capitalize">
                {authUser?.name}
              </h1>
              <p className="text-xs text-base-content/60 mt-1">
                {isUpdatingProfile ? "Updating your photo..." : "Update your profile details and settings"}
              </p>
            </div>

            {/* Form Fields */}
            <div className="w-full space-y-5">
              
              {/* Full Name Edit Card */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold flex items-center gap-2 text-base-content/75">
                    <User className="size-4 text-primary" /> Full Name
                  </span>
                </label>

                {isEditingName ? (
                  <div className="space-y-1">
                    <div className="relative flex items-center gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => {
                          setNewName(e.target.value);
                          if (nameError) setNameError("");
                        }}
                        onKeyDown={handleKeyDown}
                        className={`input input-bordered w-full pr-24 capitalize focus:px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                          nameError ? "input-error" : ""
                        }`}
                        placeholder="Enter your name"
                        disabled={isUpdatingProfile}
                        autoFocus
                      />
                      <div className="absolute right-2 flex gap-1">
                        <button
                          type="button"
                          onClick={handleSaveClick}
                          disabled={isUpdatingProfile}
                          className="btn btn-sm btn-success btn-circle shadow-sm"
                          title="Save Changes"
                        >
                          {isUpdatingProfile ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Check className="size-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelClick}
                          disabled={isUpdatingProfile}
                          className="btn btn-sm btn-ghost btn-circle"
                          title="Cancel"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                    {nameError && (
                      <span className="text-xs text-error font-medium px-1">
                        {nameError}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="group relative flex items-center">
                    <p className="w-full rounded-lg border border-base-300 bg-base-200/50 px-4 py-3 capitalize text-base-content font-medium transition-all duration-200">
                      {authUser?.name}
                    </p>
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="absolute right-3 btn btn-ghost btn-xs text-primary group-hover:bg-base-300/70 opacity-80 group-hover:opacity-100 transition-all flex items-center gap-1.5 px-2 rounded-md py-1 h-auto"
                    >
                      <Pencil className="size-3.5" />
                      <span className="text-xs font-semibold">Edit</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Email Field (Non-editable) */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-semibold flex items-center gap-2 text-base-content/75">
                    <Mail className="size-4 text-secondary" /> Email Address
                  </span>
                </label>
                <p className="w-full rounded-lg border border-base-300 bg-base-200/30 px-4 py-3 text-base-content/60">
                  {authUser?.email}
                </p>
              </div>

            </div>

            {/* Account Information Card */}
            <div className="w-full mt-8 bg-base-200/40 border border-base-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-base-content/80 flex items-center gap-2 mb-4 border-b border-base-300/60 pb-2">
                <Shield className="size-4 text-accent" /> Account Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-1 border-b border-base-300/30">
                  <span className="text-base-content/60 flex items-center gap-2">
                    <Calendar className="size-4" /> Member Since
                  </span>
                  <span className="font-semibold text-base-content">
                    {authUser?.createdAt?.split("T")[0] || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-base-content/60 flex items-center gap-2">
                    <Shield className="size-4 text-success" /> Account Status
                  </span>
                  <span className="badge badge-success badge-outline font-semibold">
                    Active
                  </span>
                </div>
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
