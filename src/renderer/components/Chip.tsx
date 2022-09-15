import { ReactNode } from 'react';
import { AiOutlineCloseSquare } from 'react-icons/ai';

interface ChipsProps {
  children: ReactNode;
  onClose: () => void;
}

const Chips = (props: ChipsProps) => {
  const { children, onClose } = props;
  return (
    <div className="Chips">
      {children}
      <AiOutlineCloseSquare className="ChipClose" onClick={() => onClose()} />
    </div>
  );
};

export default Chips;
