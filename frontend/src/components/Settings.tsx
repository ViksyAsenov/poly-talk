import { useState } from "react";
import { useUserStore } from "../store/userStore";

const Settings = () => {
  const { user, updateUser, languages } = useUserStore();
  const [displayName, setDisplayName] = useState<string | undefined>(
    user?.displayName || undefined
  );
  const [languageId, setLanguageId] = useState<string | undefined>(
    user?.languageId || undefined
  );
  const [firstName, setFirstName] = useState<string | undefined>(
    user?.firstName || undefined
  );
  const [lastName, setLastName] = useState<string | undefined>(
    user?.lastName || undefined
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Language
            </label>
            <select
              value={languageId}
              onChange={(e) => setLanguageId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            >
              <option value="none">None</option>
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            onClick={async () => {
              if (user) {
                await updateUser(
                  user.displayName === displayName ? undefined : displayName,
                  user.firstName === firstName ? undefined : firstName,
                  user.lastName === lastName ? undefined : lastName,
                  user.languageId === languageId ? undefined : languageId
                );
              }
            }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
