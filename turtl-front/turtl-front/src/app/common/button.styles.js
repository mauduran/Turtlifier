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
import styled from 'styled-components';

const DarkButtons = Component => styled(Component)`
  {
    background-color: #282c34;
    &:hover{
      background-color: #424957;
    }
    
  }
`;

const ClearButtons = Component => styled(Component)`
  {
    background-color: #fff;
    border: 1px solid #282c34;
    color: #282c34;
    &:hover{
      background-color: #dce2ee;
    }
  }
`;



export default DarkButtons;
export {
  ClearButtons
}