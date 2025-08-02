// CotizacionPDF.tsx

import {
  Document, Page, View, Text, StyleSheet, Image, 
} from '@react-pdf/renderer';
import logo from '../../assets/logos/logoPrincipal.png'; // Ajusta tu path

// Fuentes personalizadas si quieres (opcional)
// Font.register({ family: 'Montserrat', src: ... });

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 32,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff', 
    color: '#2e2e2e'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  logo: { height: 48, width: 128  },
  infoBox: { marginBottom: 4 },
  folioBox: {
    border: '1px solid #be2932',
    backgroundColor: '#e8e8e8',
    padding: 8,
    alignItems: 'center'
  },
  clienteDatos: {
    marginBottom: 12,
    marginTop: 10
  },
  tabla: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#b3b329',
    borderStyle: 'solid'
  },
  tablaHeader: {
    flexDirection: 'row',
    backgroundColor: '#b3b329',
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center'
  },
  th: {
    padding: 6,
    flexGrow: 1,
    borderRight: '1px solid #fff',
    fontWeight: 'bold',
    fontSize: 9,
  },
  thShort: { flexGrow: 0.5 },
  td: {
    padding: 6,
    borderBottom: '1px solid #ddd',
    borderRight: '1px solid #eee',
    fontSize: 9,
    flexGrow: 1
  },
  tdShort: { flexGrow: 0.5 },
  resaltado: {
    color: '#be2932',
    fontWeight: 'bold'
  },
  obsBox: {
    marginTop: 12,
    backgroundColor: '#be2932',
    color: '#fff',
    padding: 8,
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center'
  },
  obsContent: {
    color: '#222',
    backgroundColor: '#fff',
    fontWeight: 'normal',
    border: '1px solid #be2932',
    borderRadius: 4,
    padding: 10,
    fontSize: 10,
    marginTop: -3,
    marginBottom: 16,
  },
  firmasRow: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  firma: { fontWeight: 'bold', fontSize: 11, color: '#be2932' },
  legal: { fontSize: 8, color: '#be2932', marginTop: 16, textAlign: 'center' }
});

function formatoMoneda(monto: number) {
  return monto?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }) || '';
}

const CotizacionPDF = ({ costeo }: { costeo: any }) => {
  // Simula los datos como los de tu imagen
  const empresa = costeo.empresaNombre || 'IndPack';
  const folio = costeo.folio || 'COT ...';
  const fecha = costeo.fechaCotizacion || '16 Mayo 2025';
  const cliente = costeo.nombreCompleto || 'Erick Moreno';
  const proyecto = costeo.tituloPedido || 'Empaque de EQUIPO...';
  const productos = costeo.productos || [];
  const subtotal = productos.reduce((sum: number, p: any) => sum + (p.importeTotalFinanciamiento ?? 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1.7 }}>
            <Image src={logo} style={styles.logo} />
            <Text style={{ color: '#be2932', fontSize: 10, marginTop: 4 }}>{empresa}</Text>
            <Text style={{ fontSize: 9, marginTop: 1 }}>Paseo de las Lomas # 6383, Col. Lomas del Colli.</Text>
            <Text style={{ fontSize: 9 }}>Zapopan, Jal. 45010 CP</Text>
            <Text style={{ fontSize: 9 }}>Tel. +52 (33)-3165-0414</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
            <View style={styles.folioBox}>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>COTIZACIÓN</Text>
              <Text style={{ fontWeight: 600 }}>{folio}</Text>
              <Text style={{ fontSize: 9 }}>{fecha}</Text>
            </View>
          </View>
        </View>

        {/* Datos de proyecto y cliente */}
        <View style={styles.clienteDatos}>
          <Text>
            <Text style={{ fontWeight: 700 }}>A/n: </Text>{cliente}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>PROYECTO: </Text>{proyecto}
          </Text>
          <Text>
            <Text style={{ fontWeight: 700 }}>Empaque de EQUIPO: </Text>
            {costeo.descripcion || 'Tarima industrial de madera, caja de OSB con marco de madera'}
          </Text>
        </View>

        {/* Tabla de productos */}
        <View style={styles.tabla}>
            <View style={styles.tablaHeader}>
                <Text style={[styles.th, { flex: 2.5 }]}>EQUIPO</Text>
                <Text style={[styles.th, { flex: 0.7, textAlign: 'center' }]}>CANT.</Text>
                <Text style={[styles.th, { flex: 0.9, textAlign: 'center' }]}>LARGO</Text>
                <Text style={[styles.th, { flex: 0.9, textAlign: 'center' }]}>ANCHO</Text>
                <Text style={[styles.th, { flex: 0.9, textAlign: 'center' }]}>ALTO</Text>
                <Text style={[styles.th, { flex: 1.1, textAlign: 'center' }]}>P. UNIT.</Text>
                <Text style={[styles.th, { flex: 1.1, textAlign: 'center' }]}>IMPORTE</Text>
            </View>
            {productos.map((p: any, i: number) => (
            <View key={i} style={{ flexDirection: 'row', backgroundColor: i % 2 === 0 ? '#f7f7f7' : '#fff' }}>
                <Text style={[styles.td, { flex: 2.5 }]}>{p.nombre || p.equipo || ''}</Text>
                <Text style={[styles.td, { flex: 0.7, textAlign: 'center' }]}>{p.cantidad ?? 1}</Text>
                <Text style={[styles.td, { flex: 0.9, textAlign: 'center' }]}>{p.largoEmpaque ?? p.largo ?? ''}</Text>
                <Text style={[styles.td, { flex: 0.9, textAlign: 'center' }]}>{p.anchoEmpaque ?? p.ancho ?? ''}</Text>
                <Text style={[styles.td, { flex: 0.9, textAlign: 'center' }]}>{p.altoEmpaque ?? p.alto ?? ''}</Text>
                <Text style={[styles.td, { flex: 1.1, textAlign: 'center' }]}>{formatoMoneda(p.precioUnitario ?? 0)}</Text>
                <Text style={[styles.td, { flex: 1.1, textAlign: 'center' }]}>{formatoMoneda(p.importeTotalFinanciamiento ?? ((p.punit ?? 0) * (p.cantidad ?? 1)))}</Text>
            </View>
            ))}
            {/* Total */}
            <View style={{ flexDirection: 'row', borderTop: '2px solid #b3b329' }}>
                <Text style={[styles.td, { flex: 7.0, textAlign: 'right', fontWeight: 'bold', backgroundColor: '#fff' }]}>TOTAL:</Text>
                <Text style={[styles.td, { flex: 1.1, fontWeight: 'bold', textAlign: 'center' }]}>{formatoMoneda(subtotal)}</Text>
            </View>
        </View>


        {/* Observaciones */}
        <Text style={styles.obsBox}>OBSERVACIONES:</Text>
        <View style={styles.obsContent}>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Incluye:</Text> Servicio de empaque en sus instalaciones. Incluye: sensor de golpe, sensor de posición y señalizaciones para las maniobras. Y la tecnología de protección: {'\n'}
            <Text style={styles.resaltado}>Antimovimiento:</Text> con topes de madera y fleje.{'\n'}
            <Text style={styles.resaltado}>Antiestática:</Text> equipo envuelto en burbuja antiestática.{'\n'}
            <Text style={styles.resaltado}>Anticorrosión:</Text> desecante.{'\n'}
            <Text style={styles.resaltado}>Antihumedad:</Text> Bolsa al vacío de film antihumedad certificada con la norma MIL-PRF-131K Class 1 Marvelseal 470{'\n'}
            Vigencia de la cotización: 15 días. {'\n'}
            Incluye: Madera con Tratamiento Térmico (HT) y Certificado de acuerdo a la Norma NOM-144-SEMARNAT-2017{'\n'}
            <Text style={{ color: "#be2932", fontWeight: 600 }}>NO incluye maniobras para subir los equipos arriba de las tarimas.</Text>{'\n'}
            Moneda: MXN. Precios más IVA (16%){'\n'}
            Forma de pago: de acuerdo a políticas de pago pactadas con {costeo.empresaNombre || 'el cliente'}.{'\n'}
          </Text>
          <Text style={{ marginTop: 3, fontSize: 8, color: '#be2932', fontStyle: 'italic' }}>
            *Recibida su orden de compra, iniciamos el habilitado de los materiales, por esta razón no se aceptan cancelaciones*
          </Text>
        </View>

        {/* Firma y garantía */}
        <View style={styles.firmasRow}>
          <Text>
            <Text style={styles.firma}>A t e n t a m e n t e{'\n'}</Text>
            Ing. Carlos Gerardo Woo Gómez{'\n'}
            Director de Proyectos
          </Text>
        </View>
        <Text style={styles.legal}>
          IndPack Garantía: CUMPLIMIENTO DE LOS ACUERDOS POR ESCRITO AL 100%.
        </Text>
      </Page>
    </Document>
  );
};

export default CotizacionPDF;
