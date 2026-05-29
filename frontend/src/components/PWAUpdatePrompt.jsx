import { useEffect, useState } from "react";
import { RefreshCcw, X } from "lucide-react";
import { registerSW } from "virtual:pwa-register";

function PWAUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState(null);

  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,

      onNeedRefresh() {
        setNeedRefresh(true);
      },

      onOfflineReady() {
        setOfflineReady(true);

        setTimeout(() => {
          setOfflineReady(false);
        }, 4000);
      }
    });

    setUpdateServiceWorker(() => updateSW);
  }, []);

  const handleUpdate = async () => {
    if (updateServiceWorker) {
      await updateServiceWorker(true);
    }
  };

  if (!needRefresh && !offlineReady) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-[9999]">
      <div className="bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0">
            <RefreshCcw size={24} />
          </div>

          <div className="flex-1">
            {needRefresh ? (
              <>
                <h3 className="font-extrabold text-lg">
                  Nova versão disponível
                </h3>

                <p className="mt-1 text-sm text-slate-300 leading-6">
                  Há uma nova actualização do FoodHub. Clique em actualizar para
                  carregar a versão mais recente.
                </p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleUpdate}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={18} />
                    Actualizar agora
                  </button>

                  <button
                    onClick={() => setNeedRefresh(false)}
                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-2xl font-bold"
                  >
                    Depois
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-extrabold text-lg">
                  Aplicação pronta
                </h3>

                <p className="mt-1 text-sm text-slate-300 leading-6">
                  O FoodHub já está preparado para funcionar como aplicação.
                </p>
              </>
            )}
          </div>

          <button
            onClick={() => {
              setNeedRefresh(false);
              setOfflineReady(false);
            }}
            className="text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PWAUpdatePrompt;