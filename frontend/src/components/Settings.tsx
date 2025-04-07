import { useState, useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { Language } from "../types/user";

interface SettingsProps {
  onClose: () => void;
}

const Settings = ({ onClose }: SettingsProps) => {
  const { user, updateUser, languages, fetchLanguages, logout } =
    useUserStore();
  const [displayName, setDisplayName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setSelectedLanguage(user.languageId);
    }
  }, [user]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    await updateUser(displayName, selectedLanguage ?? undefined);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLanguage(value === "" ? null : value);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-secondary-bg rounded-lg shadow-lg p-6 w-full max-w-lg relative mx-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray hover:text-gray-hover text-lg"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-6 text-text">Profile</h1>

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

        <div className="mb-6">
          <label className="block text-secondary-text mb-1 font-medium">
            Primary Language
          </label>
          <select
            value={selectedLanguage || ""}
            onChange={handleLanguageChange}
            className="w-full px-3 py-2 border border-secondary-bg rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-text"
          >
            <option value="none">None</option>
            {languages.map((language: Language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleUpdateProfile}
          className="w-full bg-accent text-white py-2 rounded-lg font-medium hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          Save Changes
        </button>

        <button
          onClick={logout}
          className="w-full bg-red text-white py-2 rounded-lg font-medium hover:bg-red-hover focus:outline-none focus:ring-2 focus:red focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
