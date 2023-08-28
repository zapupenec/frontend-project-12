import { Button } from 'react-bootstrap';

import { Icon } from './Icon.jsx';

export const ChannelsBoxHeader = () => {
  console.log('');

  return (
    <div className="d-flex justify-content-between mt-1 mb-2 py-4 ps-4 pe-2">
      <b>Каналы</b>
      <Button variant="" type="button" className="p-0 btn-group-vertical text-primary">
        <Icon name="plus-square" size={20} />
        <span className="visually-hidden">+</span>
      </Button>
    </div>
  );
};
