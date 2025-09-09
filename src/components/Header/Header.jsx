import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../store/slices/themeSlice';
import { openEditor } from '../../store/slices/editorSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector(state => state.theme);

  const handleThemeChange = (e) => {
    dispatch(setTheme(e.target.value));
  };

  const handleCreateKlip = () => {
    dispatch(openEditor());
  };

  return (
    <header className={`header ${currentTheme === 'dark' ? 'headerDark' : ''}`}>
      <h1 className="headerTitle">Dashboard Builder</h1>
      
      <div className="headerActions">
        <button 
          className="btnPrimary createKlipBtn"
          onClick={handleCreateKlip}
        >
          + Create Klip
        </button>
        
        <select 
          className="themeSelector"
          value={currentTheme}
          onChange={handleThemeChange}
        >
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
          <option value="blue">Blue Theme</option>
        </select>
      </div>
    </header>
  );
};

export default Header;