import { FC } from 'react';
import styles from '../style.module.scss';

const Header: FC = props => {
   return (
      <>
         <div className={styles.Header}>
            <div className={styles.Header_logo}>{document.title}</div>
            <div className={styles.Header_navbar}></div>
         </div>
      </>
   );
};

export default Header;
