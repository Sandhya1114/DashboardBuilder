// components/Klip/KlipsGrid.js
import { useSelector, useDispatch } from 'react-redux';
import { openEditor } from '../../store/slices/editorSlice';
import KlipCard from './KlipCard';
import './KlipsGrid.css';

const KlipsGrid = () => {
  const dispatch = useDispatch();
  const { items: klips } = useSelector(state => state.klips);
  const { currentTheme } = useSelector(state => state.theme);

  if (klips.length === 0) {
    return (
      <div className="emptyState">
        <h2>No Klips Yet</h2>
        <p>Create your first klip to get started with your dashboard.</p>
        <button 
          className="btnPrimary"
          onClick={() => dispatch(openEditor())}
        >
          Create Your First Klip
        </button>
      </div>
    );
  }

  return (
    <div className={`klipsGrid ${currentTheme}`}>
      {klips.map(klip => (
        <KlipCard key={klip.id} klip={klip} />
      ))}
    </div>
  );
};

export default KlipsGrid;