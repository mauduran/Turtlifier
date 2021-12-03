import Button from '@mui/material/Button';
import DarkButtons , {ClearButtons}  from './button.styles';


const DarkButton = DarkButtons(Button);
const ClearButton = ClearButtons(Button);


export default DarkButton;
export {
  ClearButton
}
