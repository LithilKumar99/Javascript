import styled from 'styled-components';
import { Popover, Button, Pagination } from 'react-bootstrap';

const StyledButton = styled(Button)`
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
    border: 1px solid ${props => props.theme.borderColor};
    height: 40px;
    border-radius: 0.5rem;

    &:hover,
    &:focus,
    &:active{
      background-color: ${props => props.theme.borderColor};
      border-color: ${props => props.theme.backgroundColor};
      color: ${props => props.theme.backgroundColor};
      box-shadow: none;
    }
    &.btn-primary:disabled, &.btn-primary.disabled{
      color: ${props => props.theme.textColor};
      background-color: ${props => props.theme.backgroundColor};
      border-color: ${props => props.theme.borderColor};
      cursor: no-drop;
      pointer-events: auto;
    }
    &.active{
      background-color: ${props => props.theme.borderColor};
      border-color: ${props => props.theme.backgroundColor};
      color: ${props => props.theme.backgroundColor};
    }
    &:disabled {
      color: ${props => props.theme.textColor};
      background-color: ${props => props.theme.backgroundColor};
      border-color: ${props => props.theme.borderColor};
      cursor: no-drop;
      pointer-events: auto;
  }
`;

export { StyledButton };

const StyledReactPaginateComp = styled(Pagination)`

  .page-item{
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
  }
  .page-link{
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
    border: 1px solid ${props => props.theme.borderColor};
  }
  .page-item.active .page-link{
    background-color: ${props => props.theme.borderColor};
      border-color: ${props => props.theme.backgroundColor};
      color: ${props => props.theme.backgroundColor};
  }
  .page-item.disabled .page-link{
    color: #000;
    background-color: #999;
    border-color: #ccc;
    cursor: no-drop;
    pointer-events: auto;
  }
   .active{
      background-color: ${props => props.theme.borderColor};
      border-color: ${props => props.theme.backgroundColor};
      color: ${props => props.theme.backgroundColor};
    }

`;

export { StyledReactPaginateComp };


const StyledMapControlButton = styled(Button)`
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
    border: 1px solid ${props => props.theme.borderColor};
    height: 40px;
    width: 40px;
    font-size: 20px;
    border-radius: 0.5rem;

    &:hover,
    &:focus,
    &:active{
      background-color: ${props => props.theme.borderColor};
      border-color: ${props => props.theme.backgroundColor};
      color: ${props => props.theme.backgroundColor};
      box-shadow: none;
    }
    
    &:disabled {
        color: #000;
        background-color: #999;
        border-color: #ccc;
        cursor: no-drop;
        pointer-events: auto;
    }

    &.active{
      background-color: ${props => props.theme.borderColor};
      border-color: ${props => props.theme.backgroundColor};
      color: ${props => props.theme.backgroundColor};
    }
`;

export { StyledMapControlButton };


const PopoverFooterWrapper = styled(Popover.Footer || 'div')`
    border-top: 1px solid ${props => props.theme.borderColor};
    padding: 0.5rem 1rem;
    text-align: end;
    display: block;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.03);
  `;

export default PopoverFooterWrapper;


const StyledPopover = styled(Popover || 'div')`
border-color:  ${props => props.theme.backgroundColor};
font-family: ${props => props.theme.fontFamily};

.popover-arrow::after {
    border-bottom-color: ${props => props.theme.backgroundColor};
  }
  `;

export { StyledPopover };


const StyledLoaderWraper = styled('div')`
    height: 100%;
    width:100%;
    z-index: 9999;
    position: absolute;
    top:0;
    left:0;
    background-color: #ffffffc9;
    color: ${props => props.theme.textColor};
  `;

export { StyledLoaderWraper };


const StyledLoaderInner = styled('div')`
    color: ${props => props.theme.textColor};
    border: 6px solid #f3f3f3;
    border-top: 6px solid ${props => props.theme.borderColor};
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    position: relative;
    top: 45%;
    left: 45%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
      
        100% {
          transform: rotate(360deg);
        }
      }
  `;

export { StyledLoaderInner };


const StyledTreeView = styled('div')`
    border-left: 1px solid ${props => props.theme.backgroundColor};
    &:last-child {
        border-bottom: 1px solid ${props => props.theme.backgroundColor};
        border-bottom-left-radius: 4px; 
        margin-bottom: 8px;
      }
  `;

export { StyledTreeView };

const CloseButton = styled(Button)`

    background-color:  ${props => props.theme.backgroundColor};
    color:  ${props => props.theme.textColor};
    border: 1px solid  ${props => props.theme.borderColor};
    border-radius: 4px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    padding: 4px;
    font-size: 20px;
    display: block;
    line-height: 20px;
    
    &:hover,
    &:focus,
    &:active{
      background-color: ${props => props.theme.borderColor};
      border-color: ${props => props.theme.backgroundColor};
      color: ${props => props.theme.backgroundColor};
      box-shadow: none;
    }
    
    &:disabled {
        color: #000;
        background-color: #999;
        border-color: #ccc;
        cursor: no-drop;
        pointer-events: auto;
    }

    &.active{
      background-color: ${props => props.theme.borderColor};
      border-color: ${props => props.theme.backgroundColor};
      color: ${props => props.theme.backgroundColor};
    }
  `;

export { CloseButton };


