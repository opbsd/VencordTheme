# Obsidian Fallen Knight

Tema scuro per **Vencord desktop**, con vetro traslucido, colori bronzo e pietra, testi avorio e animazioni discrete. Include il plugin opzionale **ObsidianVideo** per usare un MP4 locale come sfondo.

## Download

- [Tema CSS](https://github.com/LeoxMinei/obsidian-fallen-knight/releases/latest/download/Obsidian-Fallen-Knight.theme.css)
- [Pacchetto tema e plugin](https://github.com/LeoxMinei/obsidian-fallen-knight/releases/latest/download/Obsidian-Fallen-Knight.zip)
- [Ultima release](https://github.com/LeoxMinei/obsidian-fallen-knight/releases/latest)

## Installare il tema

1. Scarica `Obsidian-Fallen-Knight.theme.css`.
2. In Discord apri **Impostazioni → Vencord → Themes → Open Themes Folder**.
3. Copia il CSS nella cartella e attiva **Obsidian Fallen Knight Video**.
4. Disattiva gli altri temi e usa un aspetto scuro di Discord.

In alternativa, aggiungi questo URL in **Online Themes**:

```text
https://raw.githubusercontent.com/LeoxMinei/obsidian-fallen-knight/main/Obsidian-Fallen-Knight.theme.css
```

Il tema funziona anche senza plugin, con un fondale scuro. Il CSS da solo non riproduce MP4. La versione pubblica non incorpora filmati, fotogrammi o screenshot privati.

## Aggiungere lo sfondo video

Per usare il video serve una **build personale di Vencord desktop**. Non basta copiare i file TypeScript nella cartella temi. Segui prima la [guida ufficiale ai plugin personalizzati](https://docs.vencord.dev/installing/custom-plugins/).

1. Copia `plugins/obsidianVideo.desktop` in `src/userplugins/obsidianVideo.desktop` della repository Vencord.
2. Procurati un MP4 locale e rinominalo **`obsidian-fallen-knight.mp4`**. Per il look originale cerca **Fallen Knight in Flower Field Rain Live Wallpaper** su [Wallpaper Waves](https://wallpaperwaves.com/).
3. Copia l'MP4 nella cartella aperta da **Open Themes Folder**, accanto al CSS.
4. Nella repository Vencord esegui:

   ```sh
   pnpm build --dev
   ```

5. Se la tua build non è già installata, segui la [guida ufficiale d'installazione](https://docs.vencord.dev/installing/).
6. Esci completamente da Discord, anche dall'icona nella barra, e riaprilo.
7. In **Vencord → Plugins** verifica che **ObsidianVideo** sia attivo.

Il video resta sul computer: il plugin legge soltanto il file indicato nella cartella temi. Non lo carica su servizi esterni. Per cambiare sfondo sostituisci l'MP4 con lo stesso nome e riavvia Discord.

### Prestazioni e accessibilità

Il player riproduce direttamente l'MP4 originale, senza convertirlo in WebP o GIF. Mantiene quindi risoluzione e frequenza dei fotogrammi del file scelto; la fluidità effettiva dipende da decoder, GPU e carico del computer.

- Video in loop, senza audio.
- Pausa quando la finestra è nascosta.
- Con **riduci movimento** il video si ferma e viene nascosto.
- I pannelli grandi non applicano blur continuo al filmato.
- Se il file manca, rimane il fondale scuro.

Il plugin è destinato a Vencord desktop. L'estensione browser e gli altri client non sono stati verificati.

## Aspetto

- Pannelli trasparenti e angoli arrotondati.
- Palette bronzo, carbone caldo e avorio.
- Friends e Active Now separati, con sfondo visibile.
- Margine sopra l'icona Home nella barra server.
- Superfici coordinate per Nitro, Shop e Quests.
- Focus visibile e preferenze di movimento/trasparenza ridotti.

All'inizio del CSS puoi modificare `--obs-accent`, `--obs-text`, `--obs-gap` e `--obs-radius`. Le opacità di `--obs-chat-surface` e `--obs-matte-background` sono definite nella sezione finale Fallen Knight: aumenta la percentuale per scurire i pannelli.

## Verifica e limiti

La build Vencord con `--dev`, il controllo TypeScript e il lint del plugin sono stati eseguiti sul codice originale della versione 2.5. Il player è stato provato in Chromium con MP4 1920×1080 a 60 fps, verificando avvio/arresto, pausa/ripresa e movimento ridotto. I layout di Friends, Nitro, Shop e Quests sono stati controllati in anteprime simulate a tre larghezze; non si tratta di una certificazione su tutte le versioni di Discord.

Discord può cambiare i nomi delle classi CSS: se una sezione perde lo stile, apri una segnalazione con versione del client e screenshot senza dati personali.

## Licenza e crediti

Codice del tema e del plugin: **GPL-3.0-or-later**, vedi [LICENSE](LICENSE). Autore: [LeoxMinei](https://github.com/LeoxMinei).

Il plugin usa le API di [Vencord](https://github.com/Vendicated/Vencord). Progetto indipendente, non affiliato a Discord o Vencord.

Lo sfondo che ha ispirato il tema è stato ottenuto da Wallpaper Waves. Il filmato e i relativi fotogrammi appartengono ai rispettivi titolari, non sono inclusi e non sono coperti dalla licenza del codice. Scarica e usa i contenuti secondo le condizioni del loro fornitore.
