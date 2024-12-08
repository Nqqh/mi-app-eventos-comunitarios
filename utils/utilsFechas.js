// utils/utilsFechas.js
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export const formatearFecha = (fecha) => {
  return moment(fecha).format('LL');
};
