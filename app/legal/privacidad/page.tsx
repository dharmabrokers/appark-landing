import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Appark',
  description: 'Política de privacidad de Appark conforme al RGPD y la LOPDGDD',
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

export default function PrivacidadPage() {
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
          Política de Privacidad
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
          En <strong>Dharma Brokers S.L.</strong> (en adelante, "Dharma Brokers" o
          "nosotros"), responsables de la aplicación <strong>Appark</strong>, nos tomamos muy
          en serio la protección de tus datos personales.
        </Paragraph>

        <Paragraph>
          Esta Política de Privacidad explica qué información recopilamos, cómo la usamos,
          con quién la compartimos y cuáles son tus derechos conforme al Reglamento General
          de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos y Garantía
          de los Derechos Digitales (LOPDGDD).
        </Paragraph>

        <SectionTitle>1. Responsable del tratamiento</SectionTitle>
        <Paragraph>
          <strong>Identidad:</strong> Dharma Brokers S.L.
          <br />
          <strong>NIF:</strong> B16959530
          <br />
          <strong>Domicilio:</strong> Palma de Mallorca, Illes Balears, España
          <br />
          <strong>Correo electrónico:</strong>{' '}
          <a href="mailto:hola@appark.es" style={{ color: '#1FB877' }}>
            hola@appark.es
          </a>
        </Paragraph>

        <SectionTitle>2. Datos que recopilamos</SectionTitle>
        <Paragraph>Cuando usas Appark, podemos recopilar:</Paragraph>
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
            <strong>Datos de registro:</strong> nombre, correo electrónico, contraseña
            encriptada (si te registras con email) o ID de proveedor (si usas login social).
          </li>
          <li>
            <strong>Datos de ubicación:</strong> coordenadas GPS cuando reportas una plaza o
            buscas aparcamiento (solo con tu consentimiento explícito).
          </li>
          <li>
            <strong>Datos de uso:</strong> plazas reportadas, puntos ganados, preferencias de
            idioma, historial de búsqueda (de forma anónima o agregada para mejorar el
            servicio).
          </li>
          <li>
            <strong>Datos técnicos:</strong> dispositivo, sistema operativo, dirección IP,
            identificador de sesión.
          </li>
        </ul>

        <SectionTitle>3. Finalidad del tratamiento y base legal</SectionTitle>
        <Paragraph>Usamos tus datos para:</Paragraph>
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
            <strong>Prestación del servicio:</strong> mostrarte plazas disponibles en tiempo
            real, permitirte reportar plazas, gestionar tu cuenta y puntos (base legal:
            ejecución del contrato).
          </li>
          <li>
            <strong>Mejora del servicio:</strong> análisis agregado de uso para optimizar la
            app (base legal: interés legítimo).
          </li>
          <li>
            <strong>Comunicaciones:</strong> notificaciones sobre plazas cercanas,
            actualizaciones de la app, promociones de sponsors (base legal: consentimiento o
            interés legítimo, según el caso; siempre puedes darte de baja).
          </li>
          <li>
            <strong>Cumplimiento legal:</strong> atender requerimientos judiciales o
            administrativos (base legal: obligación legal).
          </li>
        </ul>

        <SectionTitle>4. Conservación de los datos</SectionTitle>
        <Paragraph>
          Conservamos tus datos personales mientras mantengas tu cuenta activa. Si eliminas
          tu cuenta, borraremos tus datos personales en un plazo de 30 días, salvo que
          estemos obligados legalmente a conservarlos durante más tiempo (por ejemplo, para
          resolver disputas o cumplir con obligaciones fiscales).
        </Paragraph>

        <SectionTitle>5. Compartir datos con terceros</SectionTitle>
        <Paragraph>
          No vendemos tus datos personales. Podemos compartirlos únicamente con:
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
          <li>
            <strong>Proveedores de servicios:</strong> hosting, análisis, notificaciones push
            (bajo acuerdos de confidencialidad y protección de datos).
          </li>
          <li>
            <strong>Sponsors:</strong> solo datos agregados y anónimos (ej: "50 usuarios
            canjearon puntos en tu negocio este mes"), nunca datos personales identificables.
          </li>
          <li>
            <strong>Autoridades:</strong> cuando sea legalmente obligatorio.
          </li>
        </ul>

        <SectionTitle id="cookies">6. Cookies</SectionTitle>
        <Paragraph>
          Usamos cookies esenciales para el funcionamiento del sitio web y de la aplicación
          (sesión, preferencias de idioma). Si aceptas, también usamos cookies de análisis
          (Google Analytics) para entender cómo se usa Appark y mejorar la experiencia.
        </Paragraph>
        <Paragraph>
          Puedes gestionar tus preferencias de cookies desde el banner de consentimiento que
          aparece en tu primera visita.
        </Paragraph>

        <SectionTitle>7. Tus derechos (RGPD y LOPDGDD)</SectionTitle>
        <Paragraph>Tienes derecho a:</Paragraph>
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
            <strong>Acceso:</strong> saber qué datos personales tenemos sobre ti.
          </li>
          <li>
            <strong>Rectificación:</strong> corregir datos inexactos o incompletos.
          </li>
          <li>
            <strong>Supresión:</strong> eliminar tus datos ("derecho al olvido").
          </li>
          <li>
            <strong>Limitación:</strong> restringir el tratamiento en ciertos casos.
          </li>
          <li>
            <strong>Portabilidad:</strong> recibir tus datos en formato estructurado y
            trasladarlos a otro responsable.
          </li>
          <li>
            <strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo.
          </li>
          <li>
            <strong>No ser objeto de decisiones automatizadas:</strong> Appark no toma
            decisiones basadas únicamente en tratamiento automatizado que produzcan efectos
            jurídicos o te afecten significativamente.
          </li>
        </ul>
        <Paragraph>
          Para ejercer estos derechos, escríbenos a{' '}
          <a href="mailto:hola@appark.es" style={{ color: '#1FB877' }}>
            hola@appark.es
          </a>
          . También puedes presentar una reclamación ante la{' '}
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1FB877' }}
          >
            Agencia Española de Protección de Datos (AEPD)
          </a>
          .
        </Paragraph>

        <SectionTitle>8. Seguridad</SectionTitle>
        <Paragraph>
          Aplicamos medidas técnicas y organizativas para proteger tus datos frente a acceso
          no autorizado, pérdida o destrucción (encriptación, autenticación segura,
          cortafuegos, auditorías periódicas).
        </Paragraph>

        <SectionTitle>9. Transferencias internacionales</SectionTitle>
        <Paragraph>
          Si usamos proveedores fuera de la Unión Europea, nos aseguramos de que cumplan con
          las garantías del RGPD (cláusulas contractuales tipo, certificación Privacy Shield
          o equivalente).
        </Paragraph>

        <SectionTitle>10. Menores de edad</SectionTitle>
        <Paragraph>
          Appark está dirigida a mayores de 14 años. Si eres menor de 14 años, necesitas el
          consentimiento de tus padres o tutores para usar la app. Si detectamos que un menor
          de 14 años se ha registrado sin consentimiento parental, eliminaremos su cuenta.
        </Paragraph>

        <SectionTitle>11. Cambios en esta política</SectionTitle>
        <Paragraph>
          Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos los
          cambios significativos a través de la app o por email. La fecha de "Última
          actualización" al inicio del documento indica la versión vigente.
        </Paragraph>

        <SectionTitle>12. Contacto</SectionTitle>
        <Paragraph>
          Si tienes dudas sobre esta Política de Privacidad o sobre el tratamiento de tus
          datos, escríbenos a{' '}
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
