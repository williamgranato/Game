
// lib/storage.js
// Abstração de salvamento/carregamento local + API.
// Você pode usar installAutosave no componente principal.
export async function apiSave(id, data) {
  try {
    await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data }),
    });
  } catch {}
}

export async function apiLoad(id) {
  try {
    const r = await fetch(`/api/load?id=${encodeURIComponent(id)}`, { cache: "no-store" });
    const j = await r.json();
    return j?.data ?? null;
  } catch {
    return null;
  }
}

export function localSave(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export function localLoad(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Instala autosave periódico e ao sair da página.
// getSnapshot: () => objeto do jogo para salvar
// applySnapshot: (snap) => aplica o estado salvo (opcional no boot)
export function installAutosave({ id, getSnapshot, applySnapshot, intervalMs = 30000, localKey = "ag_autosave" }) {
  // tenta carregar primeiro
  (async () => {
    const server = await apiLoad(id);
    if (server) {
      applySnapshot?.(server);
    } else {
      const local = localLoad(localKey);
      if (local) applySnapshot?.(local);
    }
  })();

  const saveNow = () => {
    const snap = getSnapshot();
    localSave(localKey, snap);
    apiSave(id, snap);
  };

  const t = setInterval(saveNow, intervalMs);
  const onLeave = () => saveNow();
  window.addEventListener("beforeunload", onLeave);

  return () => {
    clearInterval(t);
    window.removeEventListener("beforeunload", onLeave);
  };
}
