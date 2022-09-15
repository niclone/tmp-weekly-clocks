import { ReactNode } from 'react';
import { AiOutlineCloseSquare } from 'react-icons/ai';

interface ChipsProps {
  children: ReactNode;
}

const Chips = (props: ChipsProps) => {
  const { children } = props;
  return (
    <div className="Chips">
      {children}
      <AiOutlineCloseSquare />
    </div>
  );
};

export default Chips;
