import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
   state = {
      char: null,
      loading: false,
      error: false
   };

   marvelServise = new MarvelService();

   componentDidMount() {
      this.updateChar();
   }

   componentDidUpdate(prevProps) {
      if (prevProps.charId !== this.props.charId) {
         this.updateChar();
      }
   }

   onCharLoaded = (char) => {
      this.setState({ char, loading: false, error: false });
   };

   onError = () => {
      this.setState({
         loading: false,
         error: true
      });
   };

   onCharLoading = () => {
      this.setState({ loading: true, error: false });
   };

   updateChar = () => {
      const { charId } = this.props;
      if (!charId) {
         return;
      }
      this.onCharLoading();
      this.marvelServise.getCharacter(charId).then(this.onCharLoaded).catch(this.onError);
   };

   render() {
      const { char, loading, error } = this.state;

      const skeleton = char || loading || error ? null : <Skeleton />;
      const errorMessage = error ? <ErrorMessage /> : null;
      const spinner = loading ? <Spinner /> : null;
      const content = !(loading || error) && char ? <View char={char} /> : null;

      return (
         <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
         </div>
      );
   }
}

const View = ({ char }) => {
   const { name, thumbnail, description, wiki, homepage, comics } = char;
   const style =
      thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
         ? { objectFit: 'contain' }
         : { objectFit: 'cover' };

   return (
      <>
         <div className="char__basics">
            <img src={thumbnail} alt={name} style={style} />
            <div>
               <div className="char__info-name">{name}</div>
               <div className="char__btns">
                  <a href={homepage} className="button button__main">
                     <div className="inner">homepage</div>
                  </a>
                  <a href={wiki} className="button button__secondary">
                     <div className="inner">Wiki</div>
                  </a>
               </div>
            </div>
         </div>
         <div className="char__descr">{description}</div>
         <div className="char__comics">Comics:</div>
         <ul className="char__comics-list">
            {comics.length ? null : 'comics not found'}
            {comics.slice(0, 10).map((item, idx) => {
               return (
                  <li key={idx} className="char__comics-item">
                     {item.name}
                  </li>
               );
            })}
         </ul>
      </>
   );
};

CharInfo.propTypes = {
   charId: PropTypes.number
};

export default CharInfo;
