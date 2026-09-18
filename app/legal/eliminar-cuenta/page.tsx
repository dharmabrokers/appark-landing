import { Metadata } from 'next'

/**
 * The page Google Play links to as the "account deletion URL".
 *
 * Play requires it to name the app, give the steps, and say which data is
 * deleted and which is kept and for how long. The privacy policy did not,
 * which is a listing requirement, not a nicety.
 */
export const metadata: Metadata = {
  title: 'Eliminar tu cuenta de Appark',
  description: 'Cómo eliminar tu cuenta de Appark y qué datos se borran.',
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'var(--font-display), system-ui, sans-serif', fontSize: 24, fontWeight: 800, color: '#0A2A36', marginTop: 36, marginBottom: 14 }}>
    {children}
  </h2>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 15.5, lineHeight: 1.7, color: '#2A4A56', marginBottom: 14 }}>{children}</p>
)
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul style={{ fontSize: 15.5, lineHeight: 1.7, color: '#2A4A56', marginBottom: 14, paddingLeft: 24 }}>{children}</ul>
)

export default function EliminarCuentaPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FBF6EE', padding: '80px 24px' }}>
      <article style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, padding: '48px 40px', boxShadow: '0 2px 12px rgba(10,42,54,.08)' }}>
        <h1 style={{ fontFamily: 'var(--font-display), system-ui, sans-serif', fontSize: 36, fontWeight: 800, color: '#0A2A36', marginBottom: 12 }}>
          Eliminar tu cuenta de Appark
        </h1>
        <P>
          Appark (Appark: Parking en Palma), de DHARMA BROKERS&apos; CONSULTING SL, te permite eliminar tu cuenta y tus datos
          personales en cualquier momento, desde la propia app y sin coste.
        </P>

        <H2>Desde la app (inmediato)</H2>
        <UL>
          <li>Abre Appark e inicia sesión.</li>
          <li>Ve a la pestaña <strong>Perfil</strong>.</li>
          <li>Al final de la pantalla, pulsa <strong>Eliminar mi cuenta</strong> y confirma.</li>
        </UL>
        <P>La cuenta se borra en ese momento y la app vuelve a la pantalla de inicio de sesión.</P>

        <H2>Sin la app</H2>
        <P>
          Escríbenos a <a href="mailto:hola@appark.es?subject=Eliminar%20mi%20cuenta" style={{ color: '#1FB877' }}>hola@appark.es</a> desde
          el email de tu cuenta con el asunto «Eliminar mi cuenta». La eliminamos en un plazo máximo de 30 días y te lo confirmamos por email.
        </P>

        <H2>Qué se elimina</H2>
        <UL>
          <li>Tu cuenta de acceso, nombre y email.</li>
          <li>Tus puntos, nivel y posición en el ranking.</li>
          <li>Tus cupones y premios, canjeados o no.</li>
          <li>Tus coches guardados y sus ubicaciones.</li>
          <li>Los mensajes y los informes de fallos que hayas enviado desde la app.</li>
          <li>Los datos de detección automática (distancias y precisión, sin coordenadas).</li>
        </UL>

        <H2>Qué se conserva</H2>
        <UL>
          <li>
            Las plazas que compartiste siguen en el mapa hasta que caducan (normalmente minutos u horas), pero ya
            <strong> no están asociadas a ti</strong>.
          </li>
          <li>Los datos que la ley nos obligue a guardar, solo durante el plazo legal y bloqueados para cualquier otro uso.</li>
        </UL>
        <P>
          Los datos de publicidad los trata Google como responsable independiente. Puedes restablecer tu identificador de
          publicidad desde los ajustes de tu móvil. Más detalles en la <a href="/legal/privacidad" style={{ color: '#1FB877' }}>política de privacidad</a>.
        </P>

        <H2>¿Tienes una cuenta de comercio?</H2>
        <P>
          Las cuentas de sponsor no se eliminan desde la app, para no dejar vales sin atender. Escríbenos a hola@appark.es y lo gestionamos contigo.
        </P>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #E5E5E5', textAlign: 'center' }}>
          <a href="/" style={{ color: '#1FB877', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>← Volver a appark.es</a>
        </div>
      </article>
    </div>
  )
}
