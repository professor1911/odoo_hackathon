import { Header } from "@/components/layout/header";
import { ProfileForm } from "@/components/profile/profile-form";
import { currentUser } from "@/lib/data";

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Manage Your Profile"
        description="Keep your skills and availability up to date."
      />
      <div className="p-6 flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto">
            <ProfileForm user={currentUser} />
        </div>
      </div>
    </div>
  );
}
