import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 100,
  duration: '15s',
};
export default function() {
  http.get('http://localhost:48888/reviews/2?page=1&count=5');
  sleep(1);
}