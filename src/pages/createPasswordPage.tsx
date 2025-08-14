import CreatePassword from "@/components/auth/createPassword";

const CreatePasswordPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* AnuvaConnect Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F5A42] mb-2">
            AnuvaConnect
          </h1>
          <p className="text-gray-600">Your Recovery, Connected</p>
        </div>
        <CreatePassword />
      </div>
    </div>
  );
};

export default CreatePasswordPage;
