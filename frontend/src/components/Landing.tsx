import { useUserStore } from "../store/userStore";
import ThemeToggle from "./ThemeToggle";

const Landing = () => {
  const { loginWithGoogle } = useUserStore();

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <header className="w-full p-4 flex justify-end">
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-12 text-center">
          <div>
            <h1 className="text-5xl font-bold">PolyTalk</h1>
            <p className="mt-3 text-xl text-secondary-text">
              Break language barriers instantly
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-secondary-bg rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Chat across languages seamlessly
              </h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <div className="bg-bg p-4 rounded-lg text-left">
                  <div className="text-sm text-secondary-text mb-1">
                    You write in:
                  </div>
                  <div className="font-medium">Здравейте, как сте?</div>
                  <div className="text-xs text-secondary-text mt-1">
                    Bulgarian
                  </div>
                </div>

                <div className="text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>

                <div className="bg-bg p-4 rounded-lg text-left">
                  <div className="text-sm text-secondary-text mb-1">
                    They receive in:
                  </div>
                  <div className="font-medium">Hallo, wie geht es Ihnen?</div>
                  <div className="text-xs text-secondary-text mt-1">German</div>
                </div>
              </div>
              <p className="mt-6 text-secondary-text">
                Set your preferred language and chat with anyone, anywhere.
                PolyTalk translates in real-time.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <button
              onClick={loginWithGoogle}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-6 h-6 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full p-4 text-center text-secondary-text">
        <p>© {new Date().getFullYear()} PolyTalk. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
