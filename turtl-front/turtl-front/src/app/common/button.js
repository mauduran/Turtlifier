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
import Button from '@mui/material/Button';
import DarkButtons , {ClearButtons}  from './button.styles';


const DarkButton = DarkButtons(Button);
const ClearButton = ClearButtons(Button);


export default DarkButton;
export {
  ClearButton
}
