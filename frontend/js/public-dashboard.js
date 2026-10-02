// Public read-only tournament dashboard. No Firebase authentication is used here.
const API_URL = "https://script.google.com/macros/s/AKfycbzuwPWdVqPdc-mdqUyRoJmM_2JA0sLFperKtDfxuyET4bmR1YgwM5l9-yThkLTQnBAM/exec";
const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
async function fetchDashboard() {
  const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "getPublicTournamentDashboard" }) });
  if (!response.ok) throw new Error(`Dashboard request failed (${response.status}).`);
  const result = await response.json();
  if (!result || result.success !== true || !result.dashboard) throw new Error(result?.error || "The public dashboard could not load.");
  return result.dashboard;
}
function renderMatches(matches) {
  const root = $("rounds"); root.innerHTML = "";
  if (!matches.length) { root.innerHTML = '<div class="empty">No fixtures have been generated yet. The admin will publish the bracket after verifying player payments.</div>'; return; }
  const rounds = [...new Set(matches.map(m => Number(m.round_number)))].sort((a,b) => a-b);
  rounds.forEach(roundNo => {
    const items = matches.filter(m => Number(m.round_number) === roundNo);
    const section = document.createElement("section"); section.className = "round";
    const heading = document.createElement("h3"); heading.textContent = items[0]?.round_name || `Round ${roundNo}`; section.appendChild(heading);
    items.forEach(match => {
      const card = document.createElement("article"); card.className = "match";
      const meta = document.createElement("div"); meta.className = "matchmeta";
      const label = document.createElement("span"); label.textContent = `Match ${match.match_number}`;
      const status = document.createElement("span"); status.className = "badge" + (match.status === "COMPLETED" ? " completed" : ""); status.textContent = match.status === "BYE" ? "BYE" : match.status === "COMPLETED" ? "COMPLETED" : match.status === "IN_PROGRESS" ? "LIVE" : "SCHEDULED";
      meta.append(label,status); card.appendChild(meta);
      [1,2].forEach(n => {
        const player = document.createElement("div");
        const playerName = match[`player${n}_name`] || "TBD";
        player.className = "player" + (match.winner_name && match.winner_name === playerName ? " winner" : "");
        const name = document.createElement("span"); name.textContent = playerName;
        const score = document.createElement("span"); score.className = "score"; const raw = match[`player${n}_score`]; score.textContent = raw === "" || raw === null || raw === undefined ? "—" : String(raw);
        player.append(name,score); card.appendChild(player);
      });
      section.appendChild(card);
    });
    root.appendChild(section);
  });
}
function renderHistory(history) {
  const root = $("history"); root.innerHTML = "";
  if (!history.length) { root.innerHTML = '<div class="empty">No completed tournament history yet. A tournament will appear here once its bracket exists.</div>'; return; }
  history.forEach(item => {
    const card = document.createElement("article"); card.className = "history-card";
    const name = document.createElement("strong"); name.textContent = item.name || "Chuka Tournament";
    const champion = document.createElement("div"); champion.className = "champ"; champion.textContent = item.champion ? `🏆 ${item.champion}` : "Champion not decided yet";
    const details = document.createElement("div"); details.className = "muted"; details.textContent = `${item.matches_completed || 0} of ${item.matches_total || 0} matches completed${item.status ? ` · ${item.status}` : ""}`;
    card.append(name,champion,details); root.appendChild(card);
  });
}
async function load() {
  const button = $("refresh-button"); button.disabled = true; button.textContent = "Refreshing…";
  try {
    const data = await fetchDashboard();
    const tournament = data.tournament;
    $("tournament-name").textContent = tournament?.name || "Chuka Tournament Hub";
    $("tournament-subtitle").textContent = tournament ? "Public knockout bracket, match results and tournament history." : "No current tournament is configured. You can still browse available tournament history below.";
    $("tournament-status").textContent = tournament?.status || "PUBLIC RESULTS";
    const matches = Array.isArray(data.fixtures) ? data.fixtures : [];
    const completed = matches.filter(m => m.status === "COMPLETED").length;
    const byes = matches.filter(m => m.status === "BYE").length;
    $("matches-total").textContent = matches.length; $("matches-completed").textContent = completed; $("matches-byes").textContent = byes;
    const banner = $("champion-banner"); if (data.champion) { $("champion-name").textContent = data.champion; banner.style.display = "block"; } else { banner.style.display = "none"; }
    renderMatches(matches); renderHistory(Array.isArray(data.history) ? data.history : []);
    $("last-updated").textContent = `Updated ${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`;
    $("load-message").textContent = matches.length ? `${matches.length} bracket matches · ${completed} completed · ${byes} bye(s).` : "No public fixtures yet.";
    $("load-message").className = "muted";
  } catch (error) { $("load-message").textContent = error.message || "Could not load live tournament data."; $("load-message").className = "error"; }
  finally { button.disabled = false; button.textContent = "Refresh now"; }
}
$("refresh-button").addEventListener("click", load);
load();
setInterval(load, 45000);
