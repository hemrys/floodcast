# Slutprojekt Floodcast – Reflektion Alessandro Adandedjan

## Inledning

Att arbeta med React Native-projektet **"Floodcast"** har varit både intensivt och lärorikt. Jag vill här sammanfatta mina viktigaste insikter, utmaningar och erfarenheter – både tekniska och mentala – under projektets gång.

Floodcast är en React Native-app utvecklad med Expo som visualiserar översvämningsrisker på en interaktiv karta. Som frontendansvarig i teamet fokuserade jag på att skapa en tillgänglig, prestandaoptimerad mobilupplevelse med realtidsdata från IoT-sensorer. Min roll omfattade:

- UI-utveckling
- Tillgänglighetsimplementering
- Prestandaoptimering
- Integration med backend-API

Projektet var en utmärkt möjlighet att tillämpa de teoretiska kunskaper jag fått under kursen i ett verkligt sammanhang.

## Arbete med användargränssnitt och arkitektur

Som student är det svårt att från början ha en kristallklar bild av hur arkitekturen ska se ut. Jag märkte hur strukturen förändrades allt eftersom jag lärde mig mer. Det blev tydligt hur viktig balansen är mellan att bygga små, isolerade komponenter och att skapa mer centraliserade lösningar. Det handlar om att veta när det är rätt att exportera, återanvända eller bara hålla saker enkla och lokala. *"Simple is best"* blev ett återkommande mantra.

### Komponenthierarki och Context

Jag strukturerade appen med en tydlig komponenthierarki för att minimera props-drilling och förbättra läsbarheten. Ett exempel på detta är hur `AuthContext` implementerades som:

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined)
```

i `context/AuthContext.tsx` med en `useAuth` hook som exporterar kontexten. Detta mönster använde jag konsekvent – `useFloodData` och `useLocation` hooks kapslade in komplex logik och exponerade endast nödvändiga interface.

### Navigation och Route Protection

För navigation valde jag **Expo Router** med file-based routing där `app/(tabs)` innehåller huvudskärmarna och `app/login.tsx` hanterar autentisering. Route protection implementerades genom en centraliserad guard i `app/index.tsx` som kontrollerar `isAuthenticated` från `AuthContext` och redirectar användare:

```**typescript**
return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />
```

### State Management

Statehantering löste jag genom en kombination av:
- `useState` för lokal komponentstate
- **Context API** för global state som autentisering
- **Zustand** för notifikationer i `store/useNotificationStore.ts`

### Komponentstruktur

Komponentstrukturen följer **separation of concerns**-principen med tydlig uppdelning mellan:
- `services` (API-anrop)
- `hooks` (återanvändbar logik)
- `components` (UI)
- `utils` (hjälpfunktioner)

`FloodRiskModal` delades upp i underkomponenter som `ActionButton`, `DetailItem` och `RiskHeader` i `components/flood-risk-modal/` för bättre återanvändbarhet.
## Tillgänglighetsanpassningar

Jag implementerade omfattande **WCAG-anpassningar** som dokumenteras i `README-ACCESSIBILITY.md`.

### LocationSearchBar Accessibility

För `LocationSearchBar` använde jag:
- `accessibilityRole="button"`
- `accessibilityLabel="Select location ${item.title}"`
- `accessibilityHint="Tap to navigate to this location on the map"`

för varje sökresultat i `components/search/LocationSearchBar.tsx`.

### Modal Accessibility

Modaler fick `accessibilityViewIsModal={true}` för att fokusera skärmläsare korrekt, vilket implementerades i både `FloodRiskModal.tsx` och `CustomAlert.tsx`.

`MapView`-komponenten fick:
- `accessibilityRole="image"`
- `accessibilityLabel="Map showing flood risk areas in Malmö, Sweden"`

i `app/(tabs)/index.tsx`.

### Button Components

`ActionButton`-komponenten i `components/flood-risk-modal/ActionButton.tsx` implementerar:
- `accessibilityLabel={label}`
- `accessibilityHint="Tap to ${label.toLowerCase()}"`
- `accessibilityRole="button"`

`LogoutButton` har liknande implementering med:
- `accessibilityLabel="Log out"`
- `accessibilityHint="Tap to log out of your account"`

i `components/ui/LogoutButton.tsx`.

### Form Accessibility

För formulär implementerade jag tydliga labels: `TextInput`-komponenter har:
- `accessibilityLabel="Location search input"`
- `accessibilityHint="Type to search for locations"`

i `LocationSearchBar.tsx`.

Jag föredrog generiska taggar och kompletterade med accessibility där det var nödvändigt. Min tanke kring användarupplevelsen för olika användargrupper var att appen skulle vara så intuitiv som möjligt, oavsett kognitiv förmåga eller synnedsättning, genom att hålla designen ren och konsekvent.
## Prestandaoptimering

Jag implementerade flera specifika optimeringar för att förbättra prestanda och minska resursanvändning.

### MapView Optimering

`MapView`-markörer fick `tracksViewChanges={false}` i `app/(tabs)/index.tsx`, vilket eliminerar onödiga re-renders när kartan rör sig. Detta är särskilt viktigt för prestanda när många markörer visas samtidigt.

### Debounced Search

Sökfunktionen optimerade jag med **debouncing** genom `debounce`-funktionen i `utils/debounce.ts`. I `LocationSearchBar` implementerades:

```typescript
const debouncedSearch = useCallback(debounce(async (searchQuery: string) => {
  const results = await searchLocations(searchQuery, 5);
}, 300), [])
```

Detta reducerar API-anrop från potentiellt många per sekund till max 3-4 per sökning.

### API Timeout Handling

För API-anrop använder jag `AbortController` i `utils/apiClient.ts` för timeout-hantering:

```typescript
const controller = new AbortController()
```

med `setTimeout` för att förhindra hängande requests och memory leaks.

### FlatList Optimering

`FlatList` i `LocationSearchBar.tsx` använder:
- `keyExtractor={(item) => item.id}`
- `keyboardShouldPersistTaps="handled"`

för optimerad scroll-prestanda och bättre användarupplevelse.

### Performance Monitoring

Jag testade och utvärderade effekten av dessa optimeringar med React Natives inbyggda **Performance Monitor** för att observera hur *"JS Thread"* och *"UI Thread"* påverkades. Jag övervakade även minnes- och CPU-användning med enhetens utvecklarverktyg.
## Sammanfattning och lärdomar

### Tekniska utmaningar och lösningar

En frustrerande bugg uppstod när jag använt `className` i `MapView`-komponenten efter att ha bytt från `StyleSheet` till **NativeWind**, vilket tyst kraschade komponenten. Genom att göra en diff mot en tidigare fungerande branch kunde jag identifiera problemet och lösa det.

**Paretoprincipen (80/20-regeln)** blev tydlig i praktiken – att få igång en MVP gick relativt snabbt, men att slipa på detaljer, justera designen och hantera edge cases tog fem gånger så lång tid, om inte mer. Det är lätt att underskatta hur mycket arbete som ligger i de sista 20 procenten.

### Externa begränsningar och flaskhalsar

Under projektet stötte jag också på flera yttre begränsningar och tekniska flaskhalsar:

- **Google Maps API** försenades av verifieringsproblem utan tillgång till mänsklig support
- Lång väntan på korrekt backenddata och endpoints, vilket fördröjde integrationen
- Få återkopplingar från gruppmedlemmar och en stressig slutfas, där vissa lärde sig backend samma vecka som vi skulle integrera
- Nätverksbegränsningar för lokal utveckling på fysiska enheter
- Snabba backend-ändringar där vi migrerade från `localhost` till **Neon** och **Vercel**, vilket ledde till inkonsekventa API-routes
- Uppdateringen till **Expo SDK 53**, vilket bröt vissa bibliotek och gjorde migreringen frustrerande
### Erfarenheter från Expo och React Native

**Expo Go** visade sig vara en smidig lösning för snabb utveckling, men jag insåg dess begränsningar. För appar som använder hårdvarunära funktioner eller kräver native modules är det bättre att tidigt gå över till en dev build (med `gradle`). På så vis får man bättre kontroll och slipper många begränsningar som finns i gratisversionen av **EAS services**.

React Native som plattform passade mig väldigt bra. UI-designen kändes enklare än på webben tack vare mer standardiserade skärmstorlekar. Jag uppskattade de generiska komponenterna som kändes mindre överdesignade än HTML:s semantiska struktur.

#### Fördelar med React Native ekosystemet:

- **Starkt ekosystem** kring Expo
- Inte ett överflöd av val med frameworks – det är i princip Expo eller React Native bare
- **Tydlig dokumentation**
- Hjälpsam community
- Utvecklingsupplevelsen generellt bättre än på webben
- Känns som att man bygger en *riktig produkt*, inte bara en informationssida

Detta gör mobilutveckling ännu mer motiverande. Jag är nyfiken på att testa *"bare React Native"* som jämförelse.
## Personliga reflektioner och framåtblick (LESS IS MORE)

### Psykiska aspekter av kodning

Att koda är inte bara tekniskt – det är också **psykiskt krävande**. Jag lärde mig att det är avgörande att veta när man ska ta en paus. Att sitta i timmar och kämpa med ett problem utan framsteg leder ofta bara till fler buggar.

Jag började sätta upp gränser för hur länge jag kodar i sträck och försökte lyssna på min frustration. Ibland var den bästa lösningen att:
- Byta kontext
- Arbeta på en annan feature
- Till och med arbeta på en annan app

för att få ny energi men ändå fortsätta vara produktiv.

### Viktiga lärdomar

En viktig lärdom var att göra **små, inkrementella förändringar** och testa ofta. En enda rad kod kan skapa timmar av felsökning. Jag märkte också hur mycket skillnad den sista procenten av förståelse gör – det räcker med att missa en detalj för att allt ska braka ihop.

Jag gjorde också en del dumma misstag, som att:
- Glömma byta lokal IP när jag bytte nätverk
- Fokusera för mycket på frontend när problemet låg i att backend-servern inte var öppen för externa anslutningar

### Vad är jag mest nöjd med?

Jag är mest nöjd med:
- **Tillgänglighetsimplementeringen** som går långt utöver grundkraven
- **Prestandaoptimeringarna** som gav märkbara förbättringar
- **AuthContext-strukturen** som fungerade utmärkt för att undvika props-drilling och hålla koden ren
- Hur jag hanterade de oväntade utmaningarna och lyckades leverera en fungerande applikation trots tekniska hinder och tidsbrist

Att se appen ta form och faktiskt fungera på en fysisk enhet var *oerhört tillfredsställande*.

### Vad hade jag gjort annorlunda med dagens kunskap?

Nästa gång skulle jag:
- Avvakta tills biblioteken hunnit uppdateras, istället för att stressa in i nya versioner av SDK
- Gå över till lokala dev build tidigare (med `gradle`)
- Arbeta mer med fullstack-projekt där backend-strukturen finns på plats tidigt
- Sätta upp något enkelt **BAAS** som **Supabase** från start
- Kräva en tidig deployment till en server som **Vercel**, även om det bara är en placeholder, för att undvika stress i slutet

### Framtida riktning

Jag är fortfarande öppen för React-projekt, men det är tydligt att min passion ligger inom **mobilutveckling**.
