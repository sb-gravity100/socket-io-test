import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { FormatStyle } from 'javascript-time-ago/style';
import { FC } from 'react';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

interface ITimeAgo {
   date: Date | number;
   timeStyle: string;
   wrapper?: FC<{ date: string }>;
}
export default timeAgo;

export const TimeAgoComponent: FC<ITimeAgo> = props => {
   const time = timeAgo.format(props.date, props.timeStyle);
   if (props.wrapper) {
      return <props.wrapper date={time} />;
   }
   return <>{time}</>;
};
