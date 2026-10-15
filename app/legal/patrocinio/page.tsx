import { Metadata } from 'next'
import { TERMS_VERSION } from '@/lib/alta'

export const metadata: Metadata = {
  title: 'Condiciones de patrocinio | Appark',
  description: 'Condiciones generales para los comercios patrocinadores de Appark',
}

/**
 * Las condiciones que acepta el comercio al darse de alta en appark.es/alta. La
 * versión (TERMS_VERSION, lib/alta.ts) viaja a Stripe y queda guardada con el alta
 * (bo.terms_acceptances). Si el texto cambia de forma sustancial, cambia la versión.
 */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'var(--font-display), system-ui, sans-serif', fontSize: 22, fontWeight: 800, color: '#0A2A36', marginTop: 36, marginBottom: 14 }}>
    {children}
  </h2>
)

const P = ({ n, title, children }: { n?: string; title?: string; children: React.ReactNode }) => (
  <p style={{ fontSize: 15.5, lineHeight: 1.7, color: '#2A4A56', marginBottom: 14 }}>
    {n && <strong>{n}. </strong>}
    {title && <strong>{title}. </strong>}
    {children}
  </p>
)

export default function PatrocinioPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FBF6EE', padding: '80px 24px 80px' }}>
      <article style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 'clamp(28px,5vw,48px) clamp(20px,5vw,40px)', boxShadow: '0 2px 12px rgba(10,42,54,.08)' }}>
        <h1 style={{ fontFamily: 'var(--font-display), system-ui, sans-serif', fontSize: 'clamp(28px,5vw,38px)', fontWeight: 800, color: '#0A2A36', marginBottom: 12 }}>
          Condiciones generales de patrocinio
        </h1>
        <p style={{ fontSize: 14, color: '#6E8990', marginBottom: 32 }}>Versión {TERMS_VERSION}</p>

        <SectionTitle>1. Partes, objeto y aceptación</SectionTitle>
        <P n="1.1" title="Partes">
          Estas condiciones regulan la relación entre <strong>DHARMA BROKERS&apos; CONSULTING, S.L.</strong>, CIF B27607480, con
          domicilio en Palma (en adelante, «Appark»), titular de la aplicación Appark, y la empresa o profesional que da de alta
          su negocio como patrocinador (en adelante, «el Patrocinador»).
        </P>
        <P n="1.2" title="Objeto">
          El Patrocinador aparece en la aplicación Appark como punto de canje: su negocio y sus locales en el mapa, y los
          premios que él mismo define, que los conductores pueden conseguir con los puntos que ganan en la aplicación. A cambio
          paga una cuota mensual según el paquete elegido. Es un contrato de patrocinio publicitario (art. 22 de la Ley 34/1988,
          General de Publicidad).
        </P>
        <P n="1.3" title="Solo para empresas y profesionales">
          El Patrocinador contrata para su actividad empresarial o profesional, no como consumidor.
        </P>
        <P n="1.4" title="Aceptación">
          El Patrocinador acepta estas condiciones al marcar la casilla correspondiente en el alta de appark.es, antes de
          registrar su medio de pago. Appark guarda la versión aceptada, la fecha y la hora, el correo, el CIF y la referencia
          del alta en su procesador de pagos. Esta página, con su número de versión, es la copia permanente de lo aceptado. La
          aceptación electrónica tiene plena validez (arts. 23 y 24 de la Ley 34/2002, LSSI).
        </P>
        <P n="1.5" title="Exclusiones entre empresas">
          Al no ser el Patrocinador consumidor, las partes acuerdan no aplicar las obligaciones de información previa y de acuse
          de recibo de los arts. 27.1 y 28.1 de la LSSI, sin perjuicio de lo previsto en el apartado 1.4.
        </P>
        <P n="1.6" title="Cambios">
          Appark puede actualizar estas condiciones avisando por correo con al menos 30 días de antelación. Si los cambios son
          sustanciales, el Patrocinador tendrá que aceptarlos de nuevo para seguir; si no los acepta, puede darse de baja sin
          coste antes de que entren en vigor.
        </P>

        <SectionTitle>2. Primer mes gratis, paquetes, precio y pago</SectionTitle>
        <P n="2.1" title="Primer mes gratis">
          El alta incluye 30 días sin coste. Para darse de alta, el Patrocinador registra un medio de pago (tarjeta o
          domiciliación) en Stripe, el procesador de pagos de Appark; durante esos 30 días no se le cobra nada. Durante el mes
          gratis tiene todo lo que incluye el paquete elegido, salvo el banner de portada del paquete Oro, que se activa con el
          primer cobro. Stripe le avisa por correo antes de ese primer cobro.
        </P>
        <P n="2.2" title="Paquetes">
          Los paquetes, lo que incluye cada uno y sus precios vigentes se publican en appark.es y se muestran antes de contratar.
          El Patrocinador puede cambiar de paquete en cualquier momento desde el enlace de gestión que recibe por correo; un
          cambio a un paquete inferior desactiva, sin borrarlos, los locales y premios que excedan sus límites.
        </P>
        <P n="2.3" title="Al acabar el mes gratis">
          Si el Patrocinador no ha cancelado antes del final de los 30 días, la suscripción continúa y se cobra la primera cuota
          del paquete elegido. Si ha cancelado, no se le cobra nada: al acabar el mes gratis su negocio deja de mostrarse en el
          mapa y no puede publicar premios nuevos, pero conserva el acceso a su panel para validar los vales ya emitidos
          (cláusula 3.3).
        </P>
        <P n="2.4" title="Precio y pago">
          La cuota es mensual, por adelantado, más el IVA aplicable. Se cobra en el medio de pago registrado en el alta, a través
          de Stripe, y se renueva cada mes hasta la baja. Al registrar su medio de pago en el alta, el Patrocinador autoriza
          esos cobros recurrentes.
        </P>
        <P n="2.5" title="Factura">
          Por cada cobro, Appark emite una factura completa a nombre y con el CIF del Patrocinador, que recibe por correo.
        </P>
        <P n="2.6" title="Precio fundador">
          Los comercios que se dan de alta durante 2026 pagan el precio fundador durante sus 12 primeros meses de pago; después,
          el precio estándar vigente. El mes gratis no cuenta entre esos 12.
        </P>
        <P n="2.7" title="Cambios de precio">
          Appark avisa de cualquier cambio de precio con al menos 60 días; el Patrocinador puede darse de baja antes de que se
          aplique.
        </P>
        <P n="2.8" title="Impago">
          Si un cobro falla, Stripe lo reintenta durante unos días y avisa al Patrocinador para que actualice su medio de pago.
          Mientras el primer cobro esté pendiente, el negocio no se muestra en el mapa. Si finalmente no se cobra, la suscripción
          termina y se aplica lo previsto en 2.3.
        </P>

        <SectionTitle>3. Premios, vales y obligaciones</SectionTitle>
        <P n="3.1" title="Premios">
          El Patrocinador define sus premios (qué son, cuántos y cuántos puntos cuestan), dentro de los límites de su paquete.
          Son productos o servicios de su propio negocio. Appark no paga ni compra los premios, y el Patrocinador no paga
          comisión por canje.
        </P>
        <P n="3.2" title="Vales">
          Cuando un conductor consigue un premio, recibe un vale con un código y una fecha de caducidad. El Patrocinador lo valida
          en su panel y entrega el premio en las condiciones publicadas.
        </P>
        <P n="3.3" title="Vales ya emitidos">
          El Patrocinador honrará los vales válidos emitidos mientras su premio estaba publicado, hasta su caducidad, aunque haya
          pausado el premio, cancelado durante el mes gratis o se haya dado de baja. Para ello conserva el acceso a su panel.
        </P>
        <P n="3.4" title="Obligaciones de Appark">
          Mostrar al Patrocinador según el paquete contratado; mantener el panel de gestión; avisar de los canjes; y no publicar
          contenido que perjudique su imagen.
        </P>
        <P n="3.5" title="Obligaciones del Patrocinador">
          Mantener al día sus datos, locales y premios; entregar los premios de los vales válidos; que lo que publica sea veraz y
          no infrinja derechos de terceros; y no usar Appark para fines ajenos a este contrato.
        </P>
        <P n="3.6" title="Material en el local">
          Si el Patrocinador coloca el cartel «Punto de canje» de Appark, puede obtener ventajas de visibilidad que Appark
          publique en cada momento. El cartel sigue siendo de Appark y se retira a la baja.
        </P>
        <P n="3.7" title="Sin garantía de resultados">
          Appark no garantiza un número de usuarios, visitas ni canjes. Cualquier cifra o estimación es orientativa (art. 12 de
          la Ley General de Publicidad).
        </P>

        <SectionTitle>4. Imagen, datos, responsabilidad, baja y ley aplicable</SectionTitle>
        <P n="4.1" title="Imagen del Patrocinador">
          El Patrocinador autoriza a Appark a usar su nombre comercial, logo, fotos de premios y dirección en la aplicación, la
          web y las redes sociales de Appark, incluido el anuncio de su alta o de sus premios, mientras dure el contrato. La
          autorización termina con la baja, salvo para publicaciones ya hechas.
        </P>
        <P n="4.2" title="Propiedad de Appark">
          La marca, la aplicación, el software y los materiales de Appark siguen siendo de Appark. Si la marca tuviera que
          cambiar, el contrato continúa con la nueva denominación.
        </P>
        <P n="4.3" title="Datos personales">
          Cada parte es responsable de los datos que trata. Appark solo comparte con el Patrocinador datos agregados y
          anonimizados, y el código de cada vale. Si en algún momento el Patrocinador accediera a datos personales de usuarios,
          se firmará antes un acuerdo de encargo del tratamiento (art. 28 RGPD). Los datos de contacto y de pago del Patrocinador
          se tratan para gestionar el contrato, con Stripe como encargado de los pagos, según la{' '}
          <a href="/legal/privacidad" style={{ color: '#11607A' }}>política de privacidad</a>.
        </P>
        <P n="4.4" title="Responsabilidad">
          La responsabilidad de cada parte frente a la otra se limita a las cuotas pagadas en los 6 meses anteriores al hecho,
          salvo dolo o culpa grave. Ninguna responde de daños indirectos ni lucro cesante. El Patrocinador responde de los
          premios que ofrece y de su entrega.
        </P>
        <P n="4.5" title="Duración y baja">
          El contrato es indefinido y sin permanencia. El Patrocinador puede darse de baja en cualquier momento desde el enlace de
          gestión que recibe por correo o escribiendo a hola@appark.es. Si se da de baja durante el mes gratis, no paga nada y
          sigue en el mapa hasta el día en que tocaría el primer cobro. Después, la baja tiene efecto al final del mes ya pagado,
          que no se reembolsa. Appark puede terminar el contrato con 30 días de aviso, o de inmediato si el Patrocinador incumple
          gravemente (por ejemplo, no entregar los premios de vales válidos).
        </P>
        <P n="4.6" title="Tras la baja">
          Appark retira al Patrocinador del mapa en un plazo máximo de 15 días y elimina o devuelve, a elección del Patrocinador,
          los materiales que aportó. Sigue aplicando la cláusula 3.3.
        </P>
        <P n="4.7" title="Ley y tribunales">
          Se aplica la ley española. Las partes se someten a los juzgados y tribunales de Palma de Mallorca. El contrato se
          entiende celebrado en Palma (art. 29 LSSI).
        </P>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #E5E5E5', textAlign: 'center' }}>
          <a href="/" style={{ color: '#1FB877', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>← Volver a appark.es</a>
        </div>
      </article>
    </div>
  )
}
