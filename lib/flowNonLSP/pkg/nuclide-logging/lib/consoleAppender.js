/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import util from 'util';

function layout(loggingEvent: any): Array<any> {
  const eventInfo = util.format(
    '[%s] [%s] %s - ',
    loggingEvent.startTime.toISOString(),
    loggingEvent.level,
    loggingEvent.categoryName);

  const data = loggingEvent.data.slice();

  // Since console.log support string format as first parameter, we should preserve this behavior
  // by concating eventInfo with first parameter if it is string.
  if (data.length > 0 && typeof data[0] === 'string') {
    data[0] = eventInfo + data[0];
  } else {
    data.unshift(eventInfo);
  }
  return data;
}

/**
 * Comparing to log4js's console appender(https://fburl.com/69861669), you can expand and explore
 * the object in console logged by this Appender.
 */
function consoleAppender(): (loggingEvent: any) => void {
  return loggingEvent => {
    console.log.apply(console, layout(loggingEvent)); // eslint-disable-line no-console

    // Also support outputing information into a VS Code console,
    // it is only string based, so we only take the first string
    if (global.flowOutputChannel) {
      const message = layout(loggingEvent)[0]
      global.flowOutputChannel.appendLine(message.replace("nuclide -", "flow -"))
    }
  };
}

module.exports = {
  appender: consoleAppender,
  configure: consoleAppender,
};
