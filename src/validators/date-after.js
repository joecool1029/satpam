import _ from 'lodash/fp';
import moment from 'moment';

const NOW = 'now';
const message = '<%= propertyName %> must greater than <%= ruleParams[1] %>.';

// Use object (it will be passed as reference at index.js) to represent the message,
// because we want to change it dynamically based on the offset parameter
// based on the offset parameters.
const messageObj = {
  toString: _.constant(message)
};

module.exports = {
  validator: (val, ruleObj) => {
    if (!val) {
      return true;
    }

    let date;
    const dateInputFormat = ruleObj.params[0];
    const dateInput = moment(val, dateInputFormat);
    let offset = Number(ruleObj.params[2]);
    const unit = ruleObj.params[3] || 'days';

    if (ruleObj.params[1].toLowerCase() === NOW) {
      date = moment();
    } else {
      date = moment(ruleObj.params[1], dateInputFormat);
    }

    messageObj.toString = _.constant(message);

    if (offset) {
      if (offset < 0) {
        offset = Math.abs(offset);
        messageObj.toString = _.constant(
          '<%= propertyName %> must greater than <%= ruleParams[1] %> minus <%= Math.abs(ruleParams[2]) %> <%= ruleParams[3] %>.'
        );
        date = date.subtract(offset, unit);
      } else {
        messageObj.toString = _.constant('<%= propertyName %> must greater than <%= ruleParams[1] %> plus <%= ruleParams[2] %> <%= ruleParams[3] %>.');
        date = date.add(offset, unit);
      }
    }

    return dateInput.isAfter(date, 'day');
  },
  message: messageObj
};
