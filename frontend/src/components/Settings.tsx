import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { Language } from "../types/user";

const Settings = () => {
  const { user, updateUser, languages, fetchLanguages, logout } =
    useUserStore();
  const [displayName, setDisplayName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setSelectedLanguage(user.languageId);
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    await updateUser(
      displayName,
      firstName,
      lastName,
      selectedLanguage ?? undefined
    );
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLanguage(value === "" ? null : value);
  };

  if (!user) return null;

  return (
    <div className="h-screen w-full bg-secondary-bg overflow-hidden">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-text">Settings</h1>

        <div className="bg-secondary-bg rounded-lg shadow p-6 mb-6 border border-secondary-bg">
          <h2 className="text-xl font-semibold mb-4 text-text">Profile</h2>

          <div className="mb-4">
            <label className="block text-secondary-text mb-1 font-medium">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-bg rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-text"
              placeholder="Display Name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-secondary-text mb-1 font-medium">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-bg rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-text"
              placeholder="First Name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-secondary-text mb-1 font-medium">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-secondary-bg rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-text"
              placeholder="Last Name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-secondary-text mb-1 font-medium">
              Primary Language
            </label>
            <select
              value={selectedLanguage || ""}
              onChange={handleLanguageChange}
              className="w-full px-3 py-2 border border-secondary-bg rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-text"
            >
              <option value="">Select a language</option>
              {languages.map((language: Language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleUpdateProfile}
            className="w-full bg-accent text-white py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>

        <div className="bg-secondary-bg rounded-lg shadow p-6 border border-secondary-bg">
          <h2 className="text-xl font-semibold mb-4 text-text">Account</h2>

          <button
            onClick={logout}
            className="w-full bg-error text-white py-2 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
