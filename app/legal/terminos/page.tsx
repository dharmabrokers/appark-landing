import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos de Servicio | Appark',
  description: 'Términos y condiciones de uso de Appark',
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontFamily: 'var(--font-display), system-ui, sans-serif',
      fontSize: 24,
      fontWeight: 800,
      color: '#0A2A36',
      marginTop: 40,
      marginBottom: 16,
    }}
  >
    {children}
  </h2>
)

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontSize: 15.5,
      lineHeight: 1.7,
      color: '#2A4A56',
      marginBottom: 16,
    }}
  >
    {children}
  </p>
)

export default function TerminosPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FBF6EE',
        padding: '80px 24px 80px',
      }}
    >
      <article
        style={{
          maxWidth: 800,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 16,
          padding: '48px 40px',
          boxShadow: '0 2px 12px rgba(10,42,54,.08)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display), system-ui, sans-serif',
            fontSize: 38,
            fontWeight: 800,
            color: '#0A2A36',
            marginBottom: 12,
          }}
        >
          Términos de Servicio
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#6E8990',
            marginBottom: 40,
          }}
        >
          Última actualización: 28 de junio de 2026
        </p>

        <Paragraph>
          Bienvenido a <strong>Appark</strong>, la aplicación de aparcamiento colaborativo
          para Palma de Mallorca, operada por <strong>DHARMA BROKERS' CONSULTING, SOCIEDAD LIMITADA</strong> (CIF: B27607480) (en
          adelante, "Dharma Brokers", "nosotros" o "Appark").
        </Paragraph>

        <Paragraph>
          Al usar Appark, aceptas estos Términos de Servicio. Si no estás de acuerdo, no
          uses la aplicación.
        </Paragraph>

        <SectionTitle>1. Descripción del servicio</SectionTitle>
        <Paragraph>
          Appark es una plataforma gratuita de información colaborativa sobre plazas de
          aparcamiento en Palma de Mallorca. Los usuarios reportan plazas libres en tiempo
          real y ayudan a otros conductores a encontrar aparcamiento.
        </Paragraph>
        <Paragraph>
          El servicio incluye:
        </Paragraph>
        <ul
          style={{
            fontSize: 15.5,
            lineHeight: 1.7,
            color: '#2A4A56',
            marginBottom: 16,
            paddingLeft: 24,
          }}
        >
          <li>Mapa en tiempo real de plazas de aparcamiento reportadas por usuarios</li>
          <li>Navegación GPS hacia plazas disponibles</li>
          <li>Sistema de puntos y gamificación por colaborar</li>
          <li>
            Canje de puntos en comercios y restaurantes patrocinadores ("sponsors") de Palma
          </li>
        </ul>

        <SectionTitle>2. Elegibilidad</SectionTitle>
        <Paragraph>
          Debes tener al menos 14 años para usar Appark. Si eres menor de 18 años,
          necesitas el consentimiento de un padre o tutor legal.
        </Paragraph>

        <SectionTitle>3. Cuenta de usuario</SectionTitle>
        <Paragraph>
          Para usar Appark, debes crear una cuenta proporcionando información veraz y
          completa. Eres responsable de mantener la confidencialidad de tu contraseña y de
          todas las actividades que ocurran bajo tu cuenta.
        </Paragraph>
        <Paragraph>
          No puedes transferir tu cuenta a otra persona ni usar la cuenta de otra persona
          sin su permiso.
        </Paragraph>

        <SectionTitle>4. Uso aceptable</SectionTitle>
        <Paragraph>Al usar Appark, te comprometes a:</Paragraph>
        <ul
          style={{
            fontSize: 15.5,
            lineHeight: 1.7,
            color: '#2A4A56',
            marginBottom: 16,
            paddingLeft: 24,
          }}
        >
          <li>
            Reportar plazas de aparcamiento de forma veraz y en tiempo real (no reportar
            plazas falsas o inexistentes).
          </li>
          <li>No usar la app para actividades ilegales, fraudulentas o abusivas.</li>
          <li>
            No intentar manipular el sistema de puntos, crear cuentas falsas o automatizar
            acciones (bots).
          </li>
          <li>
            No acosar, insultar o amenazar a otros usuarios o al equipo de Appark en
            comentarios o mensajes.
          </li>
          <li>
            No hacer ingeniería inversa, descompilar o intentar extraer el código fuente de
            la app.
          </li>
        </ul>
        <Paragraph>
          Nos reservamos el derecho de suspender o eliminar cuentas que infrinjan estas
          normas.
        </Paragraph>

        <SectionTitle>5. Contenido generado por usuarios</SectionTitle>
        <Paragraph>
          Los usuarios pueden reportar plazas, añadir comentarios o fotos (si la
          funcionalidad está habilitada). Al hacerlo, otorgas a Dharma Brokers una licencia
          mundial, no exclusiva, libre de regalías y sublicenciable para usar, reproducir y
          distribuir ese contenido dentro de Appark.
        </Paragraph>
        <Paragraph>
          Eres responsable del contenido que publicas. No publiques contenido que sea
          ilegal, difamatorio, ofensivo, que infrinja derechos de terceros o que viole la
          privacidad de otros.
        </Paragraph>

        <SectionTitle>6. Gamificación y sistema de puntos</SectionTitle>
        <Paragraph>
          Appark incluye un sistema de puntos que recompensa a los usuarios por reportar
          plazas y colaborar. Los puntos pueden canjearse en negocios patrocinadores
          participantes de Palma.
        </Paragraph>
        <Paragraph>
          Los puntos no tienen valor monetario y no son transferibles ni reembolsables. Nos
          reservamos el derecho de modificar, suspender o eliminar el sistema de puntos en
          cualquier momento, previa notificación razonable.
        </Paragraph>

        <SectionTitle>7. Sponsors y publicidad</SectionTitle>
        <Paragraph>
          Appark es gratuita para los usuarios porque está patrocinada por comercios locales
          de Palma. Los sponsors aparecen en el mapa como destinos recomendados y puntos de
          canje de premios.
        </Paragraph>
        <Paragraph>
          No vendemos tus datos personales a sponsors. Solo compartimos datos agregados y
          anónimos (ej: "50 usuarios canjearon puntos en tu negocio este mes").
        </Paragraph>

        <SectionTitle>8. Limitación de responsabilidad</SectionTitle>
        <Paragraph>
          Appark proporciona información colaborativa en tiempo real sobre plazas de
          aparcamiento, pero{' '}
          <strong>no garantiza la exactitud, disponibilidad o actualidad</strong> de dicha
          información.
        </Paragraph>
        <Paragraph>
          Las plazas reportadas pueden ya estar ocupadas cuando llegues. Appark no es
          responsable de:
        </Paragraph>
        <ul
          style={{
            fontSize: 15.5,
            lineHeight: 1.7,
            color: '#2A4A56',
            marginBottom: 16,
            paddingLeft: 24,
          }}
        >
          <li>Multas de tráfico, infracciones de estacionamiento o accidentes.</li>
          <li>
            Plazas que resulten no estar disponibles, ser privadas, estar en zona de
            prohibición temporal o tener restricciones desconocidas.
          </li>
          <li>
            Errores de navegación GPS, consumo de batería o datos móviles por uso de la app.
          </li>
          <li>Contenido incorrecto o abusivo reportado por otros usuarios.</li>
        </ul>
        <Paragraph>
          Usas Appark bajo tu propia responsabilidad. La app es una herramienta de ayuda,
          pero tú eres responsable de cumplir todas las normas de tráfico y aparcamiento
          locales.
        </Paragraph>

        <SectionTitle>9. Propiedad intelectual</SectionTitle>
        <Paragraph>
          Appark, su logotipo, diseño, código fuente y contenido son propiedad de Dharma
          Brokers S.L. y están protegidos por derechos de autor, marcas comerciales y otras
          leyes de propiedad intelectual.
        </Paragraph>
        <Paragraph>
          Se te concede una licencia limitada, no exclusiva, no transferible y revocable para
          usar Appark únicamente para tu uso personal y no comercial.
        </Paragraph>

        <SectionTitle>10. Modificaciones del servicio</SectionTitle>
        <Paragraph>
          Nos reservamos el derecho de modificar, suspender o discontinuar Appark (o
          cualquier parte de ella) en cualquier momento, con o sin previo aviso. No seremos
          responsables ante ti ni ante terceros por cualquier modificación, suspensión o
          discontinuación del servicio.
        </Paragraph>

        <SectionTitle>11. Cambios en estos Términos</SectionTitle>
        <Paragraph>
          Podemos actualizar estos Términos de Servicio ocasionalmente. Te notificaremos los
          cambios significativos a través de la app o por email. El uso continuado de Appark
          tras la publicación de los cambios implica tu aceptación de los nuevos términos.
        </Paragraph>

        <SectionTitle>12. Rescisión</SectionTitle>
        <Paragraph>
          Puedes dejar de usar Appark y eliminar tu cuenta en cualquier momento desde la
          configuración de la app.
        </Paragraph>
        <Paragraph>
          Nos reservamos el derecho de suspender o cancelar tu cuenta si infringes estos
          Términos, sin previo aviso y sin responsabilidad hacia ti.
        </Paragraph>

        <SectionTitle>13. Ley aplicable y jurisdicción</SectionTitle>
        <Paragraph>
          Estos Términos se rigen por las leyes de España. Cualquier disputa relacionada con
          Appark se resolverá en los tribunales de Palma de Mallorca, Illes Balears, salvo
          que la ley de protección al consumidor aplicable establezca otra jurisdicción.
        </Paragraph>

        <SectionTitle>14. Contacto</SectionTitle>
        <Paragraph>
          Si tienes preguntas sobre estos Términos de Servicio, contáctanos en{' '}
          <a href="mailto:hola@appark.es" style={{ color: '#1FB877' }}>
            hola@appark.es
          </a>
          .
        </Paragraph>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid #E5E5E5',
            textAlign: 'center',
          }}
        >
          <a
            href="/"
            style={{
              color: '#1FB877',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← Volver a appark.es
          </a>
        </div>
      </article>
    </div>
  )
}
