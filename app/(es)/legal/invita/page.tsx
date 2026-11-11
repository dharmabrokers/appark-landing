import type { Metadata } from 'next'

/**
 * Condiciones de la campaña de invitaciones entre conductores (Appark-main, 0116).
 * Las cifras reflejan los valores iniciales de app_config (invite.*). Si cambian
 * allí, hay que cambiarlas aquí (y la fecha de actualización).
 */
export const metadata: Metadata = {
  alternates: { canonical: '/legal/invita' },
  title: 'Condiciones de «Quien avisa no es traidor» | Appark',
  description: 'Condiciones de la campaña de invitaciones entre conductores de Appark.',
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'var(--font-display), system-ui, sans-serif', fontSize: 22, fontWeight: 800, color: '#0A2A36', marginTop: 32, marginBottom: 12 }}>{children}</h2>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 15.5, lineHeight: 1.7, color: '#2A4A56', marginBottom: 14 }}>{children}</p>
)
const LI = ({ children }: { children: React.ReactNode }) => (
  <li style={{ fontSize: 15.5, lineHeight: 1.7, color: '#2A4A56', marginBottom: 6 }}>{children}</li>
)

export default function InvitaTermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FBF6EE', padding: '80px 16px' }}>
      <article style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 'clamp(24px,5vw,48px) clamp(18px,5vw,40px)', boxShadow: '0 2px 12px rgba(10,42,54,.08)' }}>
        <h1 style={{ fontFamily: 'var(--font-display), system-ui, sans-serif', fontSize: 34, fontWeight: 800, color: '#0A2A36', marginBottom: 8 }}>
          «Quien avisa no es traidor»: condiciones
        </h1>
        <p style={{ fontSize: 14, color: '#6E8990', marginBottom: 28 }}>Última actualización: 11 de noviembre de 2026</p>

        <P>
          La campaña la organiza DHARMA BROKERS’ CONSULTING, S.L. (NIF B27607480), titular de Appark. Participar es gratis y no exige
          comprar nada. No es un sorteo: los premios se consiguen al cumplir las condiciones de abajo. Los puntos solo sirven dentro de
          Appark, para canjear premios que ofrecen los comercios; no se pueden cambiar por dinero.
        </P>

        <H2>Cómo se participa</H2>
        <ul style={{ paddingLeft: 20, marginBottom: 14 }}>
          <LI>Cada conductor tiene un código en la app (pestaña de puntos) que puede compartir por WhatsApp, por enlace o con un QR.</LI>
          <LI>El amigo invitado tiene que ser un usuario nuevo y escribir ese código en la app durante sus primeros 7 días. Cada cuenta puede usar un solo código, y no vale el propio.</LI>
          <LI>
            El amigo cuenta como <strong>activo</strong> cuando, dentro de sus primeros 30 días, ha avisado, dejado, confirmado u ocupado al menos
            3 plazas en 2 días distintos.
          </LI>
        </ul>

        <H2>Qué se gana</H2>
        <ul style={{ paddingLeft: 20, marginBottom: 14 }}>
          <LI>El amigo activo: 30 puntos de bienvenida.</LI>
          <LI>Quien invita: 50 puntos por cada amigo activo, con un máximo de 10 amigos con puntos al mes (los de más cuentan para las metas).</LI>
          <LI>Metas por amigos activos en total: 3, insignia «Vigía»; 5, tres meses más de puntos dobles (se suman a los que ya tenga); 10, título «Leyenda del barrio».</LI>
          <LI>Quien llegue a 5 amigos activos antes del 31 de diciembre de 2026 recibe además la insignia de fundador de la campaña.</LI>
          <LI>Los puntos se abonan en la revisión diaria posterior a la activación.</LI>
        </ul>

        <H2>Uso correcto</H2>
        <P>
          Las cuentas creadas solo para cobrar puntos, los avisos de plazas falsos o cualquier otro abuso anulan los puntos de la campaña y
          pueden suponer el bloqueo del código o de la cuenta, según los Términos de Servicio de Appark. Appark puede revisar y anular puntos
          obtenidos de forma irregular.
        </P>

        <H2>Duración y cambios</H2>
        <P>
          La campaña empieza el 11 de noviembre de 2026 y dura mientras se anuncie en la app. Appark puede cambiar las cifras o terminarla
          avisándolo en la app y en esta página; los puntos y las metas ya conseguidos se respetan.
        </P>

        <H2>Datos personales</H2>
        <P>
          Para la campaña solo se guarda quién invitó a quién y la fecha, para poder abonar los puntos. A quien invita solo se le muestra el
          número de amigos activos y pendientes, nunca sus datos. Más información en la{' '}
          <a href="/legal/privacidad" style={{ color: '#11607A', fontWeight: 700 }}>política de privacidad</a>. Dudas: hola@appark.es.
        </P>
      </article>
    </div>
  )
}
