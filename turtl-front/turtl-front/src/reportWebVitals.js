/*
############################################
############################################
###     Date: December 7, 2021           ###
###     @author Mauricio Duran Padilla   ###
###     @author Juan Pablo Ramos Robles  ###
###     @author Alfonso Ramírez Casto    ###
############################################
############################################
*/

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
