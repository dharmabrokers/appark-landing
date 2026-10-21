import type { Lang } from '@/lib/i18n'
import { TRANS } from '@/lib/i18n'
import { PLAN_FEES } from '@/lib/plans'

/**
 * Lo que la portada dice a buscadores y asistentes de IA, por idioma.
 *
 * Tres bloques que se escriben juntos porque se tienen que contradecir
 * cero veces:
 *   - meta:  título y descripción de cada versión de la portada.
 *   - tech:  la tarjeta «por dentro» de Cómo funciona.
 *   - faq:   las preguntas frecuentes. Salen en la página Y en el
 *            FAQPage del JSON-LD: Google exige que lo marcado sea visible,
 *            y los asistentes citan mejor una respuesta que se lee entera
 *            sin contexto. Por eso cada respuesta nombra Appark y Palma.
 *
 * Todo lo que se afirma aquí está comprobado contra la app (oct-2026):
 * la detección corre en Android e iPhone, la app pregunta con una
 * notificación cuando duda (decision 'asked_to_confirm'), los premios se
 * ordenan por distancia por defecto, y los puntos llegan al publicarse la
 * plaza. Nada de cifras de usuarios ni de plazas: no las tenemos, y una
 * cifra inventada en una respuesta citada por una IA no se puede retirar.
 */

export interface FaqItem { q: string; a: string }

interface SeoContent {
  meta: { title: string; description: string; ogLocale: string }
  tech: {
    eyebrow: string; title: string; intro: string
    items: { t: string; d: string }[]
    note: string
  }
  faqEyebrow: string
  faqH2: string
  faq: FaqItem[]
}

const fee = (n: number) => `${n} €`
const enFee = (n: number) => `€${n}`

function pricesEs(l: Lang, f: (n: number) => string) {
  const t = TRANS[l]
  return {
    b: t.spPlanBronzeName, s: t.spPlanSilverName, g: t.spPlanGoldName,
    bs: f(PLAN_FEES.bronze.standardFee), ss: f(PLAN_FEES.silver.standardFee), gs: f(PLAN_FEES.gold.standardFee),
    bf: f(PLAN_FEES.bronze.founderFee), sf: f(PLAN_FEES.silver.founderFee), gf: f(PLAN_FEES.gold.founderFee),
  }
}

const P = {
  es: pricesEs('es', fee),
  ca: pricesEs('ca', fee),
  en: pricesEs('en', enFee),
  de: pricesEs('de', fee),
}

export const SEO_CONTENT: Record<Lang, SeoContent> = {
  es: {
    meta: {
      title: 'Appark · App gratis para aparcar en Palma de Mallorca',
      description: 'Encuentra aparcamiento en Palma en tiempo real: los conductores comparten solos las plazas que dejan. Gratis en Android e iPhone, con premios en comercios locales.',
      ogLocale: 'es_ES',
    },
    tech: {
      eyebrow: 'Por dentro',
      title: 'Así lo hace sin que toques nada',
      intro: 'Tu móvil ya sabe si vas en coche o andando: es la misma señal que usa para contar tus pasos. Appark la aprovecha para trabajar por ti.',
      items: [
        { t: 'Recuerda dónde dejaste el coche', d: 'Cuando bajas del coche y empiezas a andar, guarda el sitio. Se acabó buscar tu propio coche por la calle.' },
        { t: 'Avisa a quien está buscando', d: 'Cuando vuelves y arrancas, tu plaza aparece en el mapa de los que dan vueltas cerca. Ellos aparcan antes y tú no has hecho nada.' },
        { t: 'Suma tus puntos solo', d: 'Cada plaza que se publica gracias a ti te da puntos al momento. Sin botones ni formularios.' },
        { t: 'Te enseña los premios más cerca', d: 'Ordena los premios por distancia, para que canjees tus puntos en el comercio que te pilla de camino.' },
      ],
      note: 'Si alguna vez duda, te lo pregunta con una notificación. Para hacerlo solo necesita permiso de ubicación y de actividad física.',
    },
    faqEyebrow: 'Preguntas frecuentes',
    faqH2: 'Aparcar en Palma con Appark: lo que nos preguntáis',
    faq: [
      { q: '¿Qué es Appark?', a: 'Appark es una app gratuita para encontrar aparcamiento en Palma de Mallorca. Los propios conductores se avisan de las plazas que dejan libres: la app detecta sola cuándo alguien aparca y cuándo se va, y lo muestra en un mapa en tiempo real.' },
      { q: '¿Cómo encuentro aparcamiento en Palma con Appark?', a: 'Abre el mapa de Appark cuando estés llegando. Verás las plazas que otros conductores acaban de dejar libres y las que están a punto de quedar libres porque su conductor ya ha vuelto al coche. Ve a la más cercana y aparca.' },
      { q: '¿Appark es gratis?', a: 'Sí. Appark es gratis para los conductores, sin suscripciones ni pagos. La pagan los comercios locales de Palma que patrocinan la app y ponen los premios.' },
      { q: '¿Tengo que avisar a mano cuando aparco o cuando me voy?', a: 'No. El móvil distingue si vas en coche o andando, y Appark usa esa señal: guarda dónde aparcas y, cuando vuelves a conducir, publica tu plaza para quien busca cerca. Si en algún momento la app duda, te lo pregunta con una notificación.' },
      { q: '¿Appark me ayuda a encontrar mi coche?', a: 'Sí. Cada vez que aparcas, Appark guarda el sitio sola, así que siempre puedes ver en el mapa dónde dejaste el coche.' },
      { q: '¿Cómo funcionan los puntos y los premios de Appark?', a: 'Cada plaza que compartes te da puntos automáticamente. Los canjeas por premios en comercios de Palma que patrocinan Appark, y la app te enseña primero los que tienes más cerca.' },
      { q: '¿Sirve si estoy de visita en Mallorca con un coche de alquiler?', a: 'Sí. Appark funciona igual con cualquier coche, también de alquiler, y está en español, catalán, inglés y alemán.' },
      { q: '¿En qué móviles funciona Appark?', a: 'Appark funciona en Android, descargándola de Google Play, y en iPhone, desde la App Store.' },
      { q: '¿Qué permisos necesita Appark y qué hace con mis datos?', a: 'Para funcionar sola, Appark necesita permiso de ubicación, también en segundo plano, y de actividad física. Cómo se tratan esos datos está explicado en su Política de Privacidad, y puedes borrar tu cuenta cuando quieras.' },
      { q: '¿En qué zona funciona Appark?', a: 'Appark está pensada para Palma de Mallorca: allí están los conductores que comparten plazas y los comercios donde se canjean los premios.' },
      { q: 'Tengo un comercio en Palma: ¿cómo puedo aparecer en Appark?', a: `Eligiendo un paquete de patrocinio (${P.es.b}, ${P.es.s} u ${P.es.g}). Tu local aparece en el mapa de Appark ante los conductores que aparcan cerca, y pones premios de tu propio negocio que atraen visitas. El primer mes es gratis y no hay permanencia.` },
      { q: '¿Cuánto cuesta patrocinar Appark?', a: `${P.es.b} ${P.es.bs}, ${P.es.s} ${P.es.ss} y ${P.es.g} ${P.es.gs} al mes, más IVA. Los comercios que se den de alta en 2026 tienen un 30% de descuento durante sus 12 primeros meses de pago: ${P.es.bf}, ${P.es.sf} y ${P.es.gf}.` },
    ],
  },

  ca: {
    meta: {
      title: 'Appark · App gratuïta per aparcar a Palma de Mallorca',
      description: 'Troba aparcament a Palma en temps real: els conductors comparteixen tots sols les places que deixen. Gratuïta a Android i iPhone, amb premis en comerços locals.',
      ogLocale: 'ca_ES',
    },
    tech: {
      eyebrow: 'Per dins',
      title: 'Així ho fa sense que toquis res',
      intro: 'El teu mòbil ja sap si vas en cotxe o a peu: és el mateix senyal que fa servir per comptar les passes. Appark l’aprofita per treballar per tu.',
      items: [
        { t: 'Recorda on has deixat el cotxe', d: 'Quan baixes del cotxe i comences a caminar, desa el lloc. S’ha acabat buscar el teu propi cotxe pel carrer.' },
        { t: 'Avisa qui està buscant', d: 'Quan tornes i arrenques, la teva plaça apareix al mapa dels qui fan voltes a prop. Ells aparquen abans i tu no has fet res.' },
        { t: 'Suma els punts tot sol', d: 'Cada plaça que es publica gràcies a tu et dona punts a l’instant. Sense botons ni formularis.' },
        { t: 'Et mostra els premis més a prop', d: 'Ordena els premis per distància, perquè bescanviïs els punts al comerç que et queda de camí.' },
      ],
      note: 'Si mai dubta, t’ho pregunta amb una notificació. Per fer-ho tot sol només necessita permís d’ubicació i d’activitat física.',
    },
    faqEyebrow: 'Preguntes freqüents',
    faqH2: 'Aparcar a Palma amb Appark: el que ens preguntau',
    faq: [
      { q: 'Què és Appark?', a: 'Appark és una app gratuïta per trobar aparcament a Palma de Mallorca. Els mateixos conductors s’avisen de les places que deixen lliures: l’app detecta tota sola quan algú aparca i quan se’n va, i ho mostra en un mapa en temps real.' },
      { q: 'Com trobo aparcament a Palma amb Appark?', a: 'Obre el mapa d’Appark quan estiguis arribant. Hi veuràs les places que altres conductors acaben de deixar lliures i les que estan a punt de quedar lliures perquè el seu conductor ja ha tornat al cotxe. Vés a la més propera i aparca.' },
      { q: 'Appark és gratuïta?', a: 'Sí. Appark és gratuïta per als conductors, sense subscripcions ni pagaments. La paguen els comerços locals de Palma que patrocinen l’app i posen els premis.' },
      { q: 'He d’avisar a mà quan aparco o quan me’n vaig?', a: 'No. El mòbil distingeix si vas en cotxe o a peu, i Appark aprofita aquest senyal: desa on aparques i, quan tornes a conduir, publica la teva plaça per a qui busca a prop. Si en algun moment l’app dubta, t’ho pregunta amb una notificació.' },
      { q: 'Appark m’ajuda a trobar el cotxe?', a: 'Sí. Cada cop que aparques, Appark desa el lloc tota sola, així que sempre pots veure al mapa on has deixat el cotxe.' },
      { q: 'Com funcionen els punts i els premis d’Appark?', a: 'Cada plaça que comparteixes et dona punts automàticament. Els bescanvies per premis en comerços de Palma que patrocinen Appark, i l’app et mostra primer els que tens més a prop.' },
      { q: 'Serveix si soc de visita a Mallorca amb un cotxe de lloguer?', a: 'Sí. Appark funciona igual amb qualsevol cotxe, també de lloguer, i està en català, castellà, anglès i alemany.' },
      { q: 'En quins mòbils funciona Appark?', a: 'Appark funciona a Android, des de Google Play, i a iPhone, des de l’App Store.' },
      { q: 'Quins permisos necessita Appark i què fa amb les meves dades?', a: 'Per funcionar tota sola, Appark necessita permís d’ubicació, també en segon pla, i d’activitat física. Com es tracten aquestes dades s’explica a la seva Política de Privacitat, i pots esborrar el compte quan vulguis.' },
      { q: 'A quina zona funciona Appark?', a: 'Appark està pensada per a Palma de Mallorca: allà hi ha els conductors que comparteixen places i els comerços on es bescanvien els premis.' },
      { q: 'Tinc un comerç a Palma: com puc sortir a Appark?', a: `Triant un paquet de patrocini (${P.ca.b}, ${P.ca.s} o ${P.ca.g}). El teu local apareix al mapa d’Appark davant els conductors que aparquen a prop, i poses premis del teu negoci que atreuen visites. El primer mes és gratuït i no hi ha permanència.` },
      { q: 'Quant costa patrocinar Appark?', a: `${P.ca.b} ${P.ca.bs}, ${P.ca.s} ${P.ca.ss} i ${P.ca.g} ${P.ca.gs} al mes, més IVA. Els comerços que es donin d’alta el 2026 tenen un 30% de descompte durant els 12 primers mesos de pagament: ${P.ca.bf}, ${P.ca.sf} i ${P.ca.gf}.` },
    ],
  },

  en: {
    meta: {
      title: 'Appark · Free parking app for Palma de Mallorca',
      description: 'Find street parking in Palma in real time: drivers automatically share the spaces they leave. Free on Android and iPhone, with rewards at local shops.',
      ogLocale: 'en_GB',
    },
    tech: {
      eyebrow: 'Under the hood',
      title: 'How it works without you lifting a finger',
      intro: 'Your phone already knows whether you’re driving or walking: it’s the same signal it uses to count your steps. Appark puts it to work for you.',
      items: [
        { t: 'Remembers where you left your car', d: 'When you get out and start walking, it saves the spot. No more wandering the streets looking for your own car.' },
        { t: 'Tells drivers who are searching', d: 'When you come back and drive off, your space appears on the map of drivers circling nearby. They park sooner, and you did nothing.' },
        { t: 'Adds up your points by itself', d: 'Every space published thanks to you earns points straight away. No buttons, no forms.' },
        { t: 'Shows you the nearest rewards', d: 'Rewards are sorted by distance, so you can redeem your points at the shop that’s on your way.' },
      ],
      note: 'If it’s ever unsure, it asks you with a notification. To do all this on its own it only needs location and physical activity permissions.',
    },
    faqEyebrow: 'FAQ',
    faqH2: 'Parking in Palma with Appark: your questions',
    faq: [
      { q: 'What is Appark?', a: 'Appark is a free app for finding parking in Palma de Mallorca. Drivers tell each other about the spaces they leave: the app detects on its own when someone parks and when they drive away, and shows it on a live map.' },
      { q: 'How do I find parking in Palma with Appark?', a: 'Open the Appark map as you arrive. You’ll see spaces other drivers have just left and ones about to become free because their driver is already back at the car. Head to the nearest one and park.' },
      { q: 'Is Appark free?', a: 'Yes. Appark is free for drivers, with no subscriptions or payments. It’s paid for by local businesses in Palma that sponsor the app and provide the rewards.' },
      { q: 'Do I have to report it manually when I park or leave?', a: 'No. Your phone can tell whether you’re driving or walking, and Appark uses that signal: it saves where you park and, when you drive off, publishes your space for drivers searching nearby. If the app is ever unsure, it asks you with a notification.' },
      { q: 'Does Appark help me find my car?', a: 'Yes. Every time you park, Appark saves the spot automatically, so you can always see on the map where you left your car.' },
      { q: 'How do Appark points and rewards work?', a: 'Every space you share earns points automatically. You redeem them for rewards at Palma businesses that sponsor Appark, and the app shows you the closest ones first.' },
      { q: 'Does it work if I’m visiting Mallorca with a rental car?', a: 'Yes. Appark works the same with any car, rentals included, and it’s available in English, German, Spanish and Catalan.' },
      { q: 'Which phones does Appark work on?', a: 'Appark works on Android, from Google Play, and on iPhone, from the App Store.' },
      { q: 'What permissions does Appark need and what does it do with my data?', a: 'To work on its own, Appark needs location permission, including in the background, and physical activity permission. How that data is handled is explained in its Privacy Policy (in Spanish), and you can delete your account at any time.' },
      { q: 'Where does Appark work?', a: 'Appark is built for Palma de Mallorca: that’s where the drivers sharing spaces and the businesses offering rewards are.' },
      { q: 'I run a business in Palma: how can I appear on Appark?', a: `By choosing a sponsorship package (${P.en.b}, ${P.en.s} or ${P.en.g}). Your venue appears on the Appark map in front of drivers parking nearby, and you offer rewards from your own business that bring in visits. The first month is free and there’s no minimum commitment.` },
      { q: 'How much does sponsoring Appark cost?', a: `${P.en.b} ${P.en.bs}, ${P.en.s} ${P.en.ss} and ${P.en.g} ${P.en.gs} per month, plus VAT. Businesses that sign up in 2026 get 30% off for their first 12 paid months: ${P.en.bf}, ${P.en.sf} and ${P.en.gf}.` },
    ],
  },

  de: {
    meta: {
      title: 'Appark · Kostenlose Park-App für Palma de Mallorca',
      description: 'Finde in Palma in Echtzeit einen Parkplatz: Autofahrer teilen automatisch die Plätze, die sie freimachen. Kostenlos für Android und iPhone, mit Prämien in lokalen Geschäften.',
      ogLocale: 'de_DE',
    },
    tech: {
      eyebrow: 'Unter der Haube',
      title: 'So funktioniert es, ohne dass du etwas tun musst',
      intro: 'Dein Handy weiß schon, ob du fährst oder gehst: Es ist dasselbe Signal, mit dem es deine Schritte zählt. Appark nutzt es für dich.',
      items: [
        { t: 'Merkt sich, wo dein Auto steht', d: 'Wenn du aussteigst und losgehst, speichert es den Ort. Nie wieder das eigene Auto in fremden Straßen suchen.' },
        { t: 'Sagt Suchenden Bescheid', d: 'Wenn du zurückkommst und losfährst, erscheint dein Platz auf der Karte der Fahrer, die in der Nähe kreisen. Sie parken schneller – und du hast nichts getan.' },
        { t: 'Sammelt deine Punkte von selbst', d: 'Jeder Platz, der dank dir veröffentlicht wird, bringt sofort Punkte. Ohne Knöpfe, ohne Formulare.' },
        { t: 'Zeigt dir die nächsten Prämien', d: 'Die Prämien sind nach Entfernung sortiert, damit du deine Punkte im Geschäft auf deinem Weg einlöst.' },
      ],
      note: 'Ist es sich einmal nicht sicher, fragt es per Benachrichtigung nach. Dafür braucht es nur die Berechtigungen für Standort und körperliche Aktivität.',
    },
    faqEyebrow: 'Häufige Fragen',
    faqH2: 'Parken in Palma mit Appark: eure Fragen',
    faq: [
      { q: 'Was ist Appark?', a: 'Appark ist eine kostenlose App, um in Palma de Mallorca einen Parkplatz zu finden. Autofahrer informieren sich gegenseitig über die Plätze, die sie freimachen: Die App erkennt von selbst, wann jemand parkt und wann er wegfährt, und zeigt es auf einer Live-Karte.' },
      { q: 'Wie finde ich mit Appark einen Parkplatz in Palma?', a: 'Öffne die Karte von Appark, wenn du ankommst. Du siehst Plätze, die andere gerade freigemacht haben, und solche, die gleich frei werden, weil ihr Fahrer schon wieder am Auto ist. Fahr zum nächsten und park dort.' },
      { q: 'Ist Appark kostenlos?', a: 'Ja. Appark ist für Autofahrer kostenlos, ohne Abo und ohne Zahlungen. Finanziert wird die App von lokalen Geschäften in Palma, die sie sponsern und die Prämien stellen.' },
      { q: 'Muss ich selbst melden, wenn ich parke oder wegfahre?', a: 'Nein. Dein Handy erkennt, ob du fährst oder zu Fuß gehst, und Appark nutzt dieses Signal: Es speichert, wo du parkst, und wenn du wieder losfährst, wird dein Platz für Suchende in der Nähe veröffentlicht. Ist sich die App einmal nicht sicher, fragt sie per Benachrichtigung nach.' },
      { q: 'Hilft mir Appark, mein Auto wiederzufinden?', a: 'Ja. Jedes Mal, wenn du parkst, speichert Appark den Ort automatisch, sodass du auf der Karte immer siehst, wo dein Auto steht.' },
      { q: 'Wie funktionieren die Punkte und Prämien von Appark?', a: 'Jeder Platz, den du teilst, bringt dir automatisch Punkte. Du löst sie bei Geschäften in Palma ein, die Appark sponsern, und die App zeigt dir die nächstgelegenen zuerst.' },
      { q: 'Funktioniert das auch, wenn ich mit einem Mietwagen auf Mallorca Urlaub mache?', a: 'Ja. Appark funktioniert mit jedem Auto, auch mit Mietwagen, und ist auf Deutsch, Englisch, Spanisch und Katalanisch verfügbar.' },
      { q: 'Auf welchen Handys läuft Appark?', a: 'Appark läuft auf Android über Google Play und auf dem iPhone über den App Store.' },
      { q: 'Welche Berechtigungen braucht Appark und was passiert mit meinen Daten?', a: 'Damit Appark von selbst funktioniert, braucht die App die Standortberechtigung, auch im Hintergrund, und die Berechtigung für körperliche Aktivität. Wie diese Daten verarbeitet werden, steht in der Datenschutzerklärung (auf Spanisch), und du kannst dein Konto jederzeit löschen.' },
      { q: 'Wo funktioniert Appark?', a: 'Appark ist für Palma de Mallorca gemacht: Dort sind die Fahrer, die Plätze teilen, und die Geschäfte, bei denen man Prämien einlöst.' },
      { q: 'Ich habe ein Geschäft in Palma: Wie komme ich in Appark?', a: `Mit einem Sponsoring-Paket (${P.de.b}, ${P.de.s} oder ${P.de.g}). Dein Laden erscheint auf der Karte von Appark vor Autofahrern, die in der Nähe parken, und du bietest Prämien aus deinem eigenen Geschäft an, die Besuche bringen. Der erste Monat ist kostenlos, ohne Mindestlaufzeit.` },
      { q: 'Was kostet ein Sponsoring bei Appark?', a: `${P.de.b} ${P.de.bs}, ${P.de.s} ${P.de.ss} und ${P.de.g} ${P.de.gs} pro Monat zzgl. MwSt. Geschäfte, die sich 2026 anmelden, erhalten in den ersten 12 bezahlten Monaten 30 % Rabatt: ${P.de.bf}, ${P.de.sf} und ${P.de.gf}.` },
    ],
  },
}
