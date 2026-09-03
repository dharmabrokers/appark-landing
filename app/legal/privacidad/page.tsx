import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Appark',
  description: 'Política de privacidad de Appark conforme al RGPD y la LOPDGDD',
}

const SectionTitle = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2
    id={id}
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
          Última actualización: 3 de septiembre de 2026
        </p>

        <Paragraph>
          En <strong>DHARMA BROKERS' CONSULTING, SOCIEDAD LIMITADA</strong> (en adelante, "Dharma Brokers" o
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
          <strong>Identidad:</strong> DHARMA BROKERS' CONSULTING, SOCIEDAD LIMITADA
          <br />
          <strong>CIF:</strong> B27607480
          <br />
          <strong>Domicilio fiscal:</strong> C/ Emili Darder Batle, 4A. Palma 07011, Baleares
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
            <strong>Datos de ubicación (primer plano):</strong> coordenadas GPS cuando
            reportas una plaza, buscas aparcamiento o validas un reporte (solo con tu
            consentimiento explícito, mientras usas la app).
          </li>
          <li>
            <strong>Datos de ubicación (segundo plano):</strong> si activas la detección
            automática, la app registra tu ubicación aproximada incluso cuando está cerrada o
            no la estás usando, para poder avisarte cuando te acercas a tu coche guardado o
            detectar que acabas de aparcar. Ver el detalle en el apartado siguiente.
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
          <li>
            <strong>Identificador de publicidad:</strong> el identificador publicitario que
            tu dispositivo asigna a la app (Advertising ID en Android). Lo utiliza nuestro
            proveedor de publicidad para medir y, si lo consientes, personalizar los
            anuncios. Es un identificador reiniciable que puedes restablecer o desactivar en
            cualquier momento desde los ajustes de tu dispositivo. Ver el apartado 6.
          </li>
        </ul>

        <div
          style={{
            background: '#FBF6EE',
            border: '1.5px solid #FF6A3D',
            borderRadius: 14,
            padding: '20px 22px',
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontSize: 15.5,
              lineHeight: 1.7,
              color: '#0A2A36',
              margin: 0,
              fontWeight: 700,
            }}
          >
            📍 Uso de la ubicación en segundo plano
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#2A4A56', marginTop: 10, marginBottom: 0 }}>
            La función principal de Appark —avisar a la comunidad cuando dejas una plaza libre—
            solo funciona si la app puede detectar tu ubicación aproximada mientras está
            cerrada o no la estás usando activamente. Con tu permiso explícito (&quot;Permitir
            todo el tiempo&quot;), Appark usa esta ubicación en segundo plano exclusivamente
            para:
          </p>
          <ul style={{ fontSize: 15, lineHeight: 1.7, color: '#2A4A56', marginTop: 10, marginBottom: 0, paddingLeft: 22 }}>
            <li>Detectar cuando te acercas al coche que guardaste, para preguntarte si vas a dejar la plaza libre.</li>
            <li>Detectar cuando acabas de aparcar, para ofrecerte guardar la ubicación de tu coche con un toque.</li>
          </ul>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#2A4A56', marginTop: 10, marginBottom: 0 }}>
            Esta ubicación en segundo plano nunca se comparte con sponsors ni terceros, no se
            usa con fines publicitarios y puedes desactivarla en cualquier momento desde los
            ajustes de permisos de tu dispositivo o borrando tu coche guardado en la app.
          </p>
        </div>

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
            <strong>Publicidad:</strong> mostrar y medir los anuncios que financian la app
            (base legal: interés legítimo para los anuncios no personalizados y su medición;
            tu consentimiento para los personalizados, que puedes retirar cuando quieras).
            Ver el apartado 6.
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
            <strong>Proveedor de publicidad:</strong> Google Ireland Limited, a través de
            Google AdMob, para mostrar y medir los anuncios descritos en el apartado 6.
            Recibe tu identificador de publicidad, tu dirección IP y datos técnicos del
            dispositivo. Google actúa como responsable independiente respecto de estos
            datos, conforme a sus propias condiciones.
          </li>
          <li>
            <strong>Autoridades:</strong> cuando sea legalmente obligatorio.
          </li>
        </ul>

        <SectionTitle id="publicidad">6. Publicidad</SectionTitle>
        <Paragraph>
          Appark es gratuita y se financia con publicidad. Mostramos dos tipos de anuncios en
          el espacio inferior de la app: banners de los comercios colaboradores (sponsors) que
          contratan ese espacio directamente con nosotros, y anuncios servidos por{' '}
          <strong>Google AdMob</strong>.
        </Paragraph>
        <Paragraph>
          Para los anuncios de AdMob, Google recibe tu identificador de publicidad, tu
          dirección IP y datos técnicos del dispositivo. Con ellos puede estimar tu ubicación
          aproximada (a nivel de ciudad o región, derivada de la IP), medir impresiones y
          detectar fraude. Si has dado tu consentimiento, también los utiliza para
          personalizar los anuncios que ves.
        </Paragraph>
        <div
          style={{
            background: '#FBF6EE',
            border: '1.5px solid #FF6A3D',
            borderRadius: 14,
            padding: '20px 22px',
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#2A4A56', marginTop: 0, marginBottom: 0 }}>
            <strong>La ubicación precisa de tu coche y tu ubicación en segundo plano no se
            usan para publicidad, ni se comparten con Google ni con ningún anunciante.</strong>{' '}
            Los datos de aparcamiento que recoge Appark sirven para el servicio de plazas y
            para nada más. El único dato con finalidad publicitaria que sale de la app es el
            identificador de publicidad junto con los datos técnicos descritos arriba.
          </p>
        </div>
        <Paragraph>
          <strong>Tu consentimiento.</strong> La primera vez que abres la app te mostramos un
          formulario de consentimiento gestionado por la Plataforma de Mensajes de Usuario de
          Google, donde eliges si aceptas los anuncios personalizados. Si no lo aceptas,
          seguirás viendo anuncios, pero no personalizados. Puedes cambiar tu decisión en
          cualquier momento desde <strong>Perfil → Opciones de privacidad de los anuncios</strong>,
          con la misma facilidad con la que la diste. La base legal es tu consentimiento.
        </Paragraph>
        <Paragraph>
          <strong>Cómo limitar la publicidad.</strong> Puedes restablecer o eliminar tu
          identificador de publicidad desde los ajustes de tu dispositivo (en Android,
          Ajustes → Privacidad → Anuncios), lo que impide que se te asocie un perfil
          publicitario persistente. Encontrarás información sobre cómo trata Google estos
          datos en su{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1FB877' }}
          >
            política de socios publicitarios
          </a>
          .
        </Paragraph>

        <SectionTitle id="cookies">7. Cookies</SectionTitle>
        <Paragraph>
          Usamos cookies esenciales para el funcionamiento del sitio web y de la aplicación
          (sesión, preferencias de idioma). Si aceptas, también usamos cookies de análisis
          (Google Analytics) para entender cómo se usa Appark y mejorar la experiencia.
        </Paragraph>
        <Paragraph>
          Puedes gestionar tus preferencias de cookies desde el banner de consentimiento que
          aparece en tu primera visita.
        </Paragraph>

        <SectionTitle>8. Tus derechos (RGPD y LOPDGDD)</SectionTitle>
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

        <SectionTitle>9. Seguridad</SectionTitle>
        <Paragraph>
          Aplicamos medidas técnicas y organizativas para proteger tus datos frente a acceso
          no autorizado, pérdida o destrucción (encriptación, autenticación segura,
          cortafuegos, auditorías periódicas).
        </Paragraph>

        <SectionTitle>10. Transferencias internacionales</SectionTitle>
        <Paragraph>
          Algunos de nuestros proveedores, como Google, pueden tratar datos fuera del
          Espacio Económico Europeo. En esos casos la transferencia se ampara en las
          garantías previstas por el RGPD: cláusulas contractuales tipo aprobadas por la
          Comisión Europea y, para proveedores estadounidenses adheridos, el Marco de
          Privacidad de Datos UE-EE. UU.
        </Paragraph>

        <SectionTitle>11. Menores de edad</SectionTitle>
        <Paragraph>
          Appark está dirigida a mayores de 14 años. Si eres menor de 14 años, necesitas el
          consentimiento de tus padres o tutores para usar la app. Si detectamos que un menor
          de 14 años se ha registrado sin consentimiento parental, eliminaremos su cuenta.
        </Paragraph>

        <SectionTitle>12. Cambios en esta política</SectionTitle>
        <Paragraph>
          Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos los
          cambios significativos a través de la app o por email. La fecha de "Última
          actualización" al inicio del documento indica la versión vigente.
        </Paragraph>

        <SectionTitle>13. Contacto</SectionTitle>
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
