import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
   state = {
      charList: [],
      loading: true,
      error: false,
      newItemLoading: false,
      offset: 210,
      charEnded: false
   };

   cardsRef = [];

   createCharRefs = (card) => {
      this.cardsRef.push(card);
   };

   marvelService = new MarvelService();

   componentDidMount() {
      this.onRequest();
   }

   onRequest = (offset) => {
      this.onCharListLoading();
      this.marvelService.getAllCharacters(offset).then(this.onCharListLoaded).catch(this.onError);
   };

   onCharListLoading = () => {
      this.setState({
         newItemLoading: true
      });
   };

   onCharListLoaded = (charList) => {
      let ended = false;
      if (charList.length < 9) {
         ended = true;
      }

      this.setState((state) => ({
         charList: [...state.charList, ...charList],
         loading: false,
         newItemLoading: false,
         offset: state.offset + 9,
         charEnded: ended
      }));
   };

   onError = () => {
      this.setState({ loading: false, error: true });
   };

   renderList = (arr) =>
      arr.map((item, idx) => {
         const style =
            item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
               ? { objectFit: 'contain' }
               : { objectFit: 'cover' };


         return (
            <li
               key={item.id}
               ref={this.createCharRefs}
               tabIndex={idx + 1}
               className="char__item"
               onClick={() => {
                  this.props.onCharSelected(item.id);

                  this.cardsRef.forEach((card, i) => {
                     if (i !== idx) {
                        card.classList.remove('char__item_selected');
                     } else {
                        this.cardsRef[idx].classList.add('char__item_selected');
                     }
                  });
               }}
            >
               <img src={item.thumbnail} alt={item.name} style={style} />
               <div className="char__name">{item.name}</div>
            </li>
         );
      });

   render() {
      const { loading, error, charList, newItemLoading, offset, charEnded } = this.state;

      if (loading) {
         return <Spinner />;
      }

      if (error) {
         return <ErrorMessage />;
      }

      return (
         <div className="char__list">
            <ul className="char__grid">{this.renderList(charList)}</ul>
            <button
               className="button button__main button__long"
               disabled={newItemLoading}
               style={{ display: charEnded ? 'none' : 'block' }}
               onClick={() => this.onRequest(offset)}
            >
               <div className="inner">load more</div>
            </button>
         </div>
      );
   }
}

export default CharList;
