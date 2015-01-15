var Nedb = require('nedb');
var sunset = new Nedb({ filename: 'sunset.db', autoload: true });
var dates = [{date:'Nov 1', sunrise: '6:30',  sunset: '16:23'},
{date:'Nov 2', sunrise: '6:32',  sunset: '16:21'},
{date:'Nov 3', sunrise: '6:33',  sunset: '16:20'},
{date:'Nov 4', sunrise: '6:35',  sunset: '16:18'},
{date:'Nov 5', sunrise: '6:37',  sunset: '16:16'},
{date:'Nov 6', sunrise: '6:38',  sunset: '16:15'},
{date:'Nov 7', sunrise: '6:40',  sunset: '16:13'},
{date:'Nov 8', sunrise: '6:42',  sunset: '16:12'},
{date:'Nov 9', sunrise: '6:43',  sunset: '16:10'},
{date:'Nov 10', sunrise: '6:45',  sunset: '16:09'},
{date:'Nov 11', sunrise: '6:47',  sunset: '16:07'},
{date:'Nov 12', sunrise: '6:48',  sunset: '16:06'},
{date:'Nov 13', sunrise: '6:50',  sunset: '16:04'},
{date:'Nov 14', sunrise: '6:52',  sunset: '16:03'},
{date:'Nov 15', sunrise: '6:53',  sunset: '16:02'},
{date:'Nov 16', sunrise: '6:55',  sunset: '16:00'},
{date:'Nov 17', sunrise: '6:56',  sunset: '15:59'},
{date:'Nov 18', sunrise: '6:58',  sunset: '15:58'},
{date:'Nov 19', sunrise: '7:00',  sunset: '15:57'},
{date:'Nov 20', sunrise: '7:01',  sunset: '15:56'},
{date:'Nov 21', sunrise: '7:03',  sunset: '15:55'},
{date:'Nov 22', sunrise: '7:04',  sunset: '15:54'},
{date:'Nov 23', sunrise: '7:06',  sunset: '15:53'},
{date:'Nov 24', sunrise: '7:07',  sunset: '15:52'},
{date:'Nov 25', sunrise: '7:09',  sunset: '15:51'},
{date:'Nov 26', sunrise: '7:10',  sunset: '15:50'},
{date:'Nov 27', sunrise: '7:12',  sunset: '15:49'},
{date:'Nov 28', sunrise: '7:13',  sunset: '15:48'},
{date:'Nov 29', sunrise: '7:15',  sunset: '15:47'},
{date:'Nov 30', sunrise: '7:16',  sunset: 'chód '},
{date:'Dec 1', sunrise: '7:17',  sunset: '15:46'},
{date:'Dec 2', sunrise: '7:19',  sunset: '15:45'},
{date:'Dec 3', sunrise: '7:20',  sunset: '15:45'},
{date:'Dec 4', sunrise: '7:21',  sunset: '15:44'},
{date:'Dec 5', sunrise: '7:23',  sunset: '15:44'},
{date:'Dec 6', sunrise: '7:24',  sunset: '15:44'},
{date:'Dec 7', sunrise: '7:25',  sunset: '15:43'},
{date:'Dec 8', sunrise: '7:26',  sunset: '15:43'},
{date:'Dec 9', sunrise: '7:27',  sunset: '15:43'},
{date:'Dec 10', sunrise: '7:28',  sunset: '15:43'},
{date:'Dec 11', sunrise: '7:29',  sunset: '15:42'},
{date:'Dec 12', sunrise: '7:30',  sunset: '15:42'},
{date:'Dec 13', sunrise: '7:31',  sunset: '15:42'},
{date:'Dec 14', sunrise: '7:32',  sunset: '15:42'},
{date:'Dec 15', sunrise: '7:33',  sunset: '15:42'},
{date:'Dec 16', sunrise: '7:34',  sunset: '15:43'},
{date:'Dec 17', sunrise: '7:35',  sunset: '15:43'},
{date:'Dec 18', sunrise: '7:36',  sunset: '15:43'},
{date:'Dec 19', sunrise: '7:36',  sunset: '15:43'},
{date:'Dec 20', sunrise: '7:37',  sunset: '15:44'},
{date:'Dec 21', sunrise: '7:38',  sunset: '15:44'},
{date:'Dec 22', sunrise: '7:38',  sunset: '15:44'},
{date:'Dec 23', sunrise: '7:39',  sunset: '15:45'},
{date:'Dec 24', sunrise: '7:39',  sunset: '15:45'},
{date:'Dec 25', sunrise: '7:40',  sunset: '15:46'},
{date:'Dec 26', sunrise: '7:40',  sunset: '15:47'},
{date:'Dec 27', sunrise: '7:40',  sunset: '15:47'},
{date:'Dec 28', sunrise: '7:41',  sunset: '15:48'},
{date:'Dec 29', sunrise: '7:41',  sunset: '15:49'},
{date:'Dec 30', sunrise: '7:41',  sunset: '15:50'},
{date:'Dec 31', sunrise: '7:41',  sunset: '15:51'},
{date:'Jan 1', sunrise: '7:41',  sunset: '15:52'},
{date:'Jan 2', sunrise: '7:41',  sunset: '15:53'},
{date:'Jan 3', sunrise: '7:41',  sunset: '15:54'},
{date:'Jan 4', sunrise: '7:41',  sunset: '15:55'},
{date:'Jan 5', sunrise: '7:41',  sunset: '15:56'},
{date:'Jan 6', sunrise: '7:41',  sunset: '15:57'},
{date:'Jan 7', sunrise: '7:40',  sunset: '15:58'},
{date:'Jan 8', sunrise: '7:40',  sunset: '16:00'},
{date:'Jan 9', sunrise: '7:40',  sunset: '16:01'},
{date:'Jan 10', sunrise: '7:39',  sunset: '16:02'},
{date:'Jan 11', sunrise: '7:39',  sunset: '16:03'},
{date:'Jan 12', sunrise: '7:38',  sunset: '16:05'},
{date:'Jan 13', sunrise: '7:38',  sunset: '16:06'},
{date:'Jan 14', sunrise: '7:37',  sunset: '16:07'},
{date:'Jan 15', sunrise: '7:36',  sunset: '16:09'},
{date:'Jan 16', sunrise: '7:36',  sunset: '16:10'},
{date:'Jan 17', sunrise: '7:35',  sunset: '16:12'},
{date:'Jan 18', sunrise: '7:34',  sunset: '16:13'},
{date:'Jan 19', sunrise: '7:33',  sunset: '16:15'},
{date:'Jan 20', sunrise: '7:32',  sunset: '16:16'},
{date:'Jan 21', sunrise: '7:32',  sunset: '16:18'},
{date:'Jan 22', sunrise: '7:31',  sunset: '16:20'},
{date:'Jan 23', sunrise: '7:30',  sunset: '16:21'},
{date:'Jan 24', sunrise: '7:28',  sunset: '16:23'},
{date:'Jan 25', sunrise: '7:27',  sunset: '16:24'},
{date:'Jan 26', sunrise: '7:26',  sunset: '16:26'},
{date:'Jan 27', sunrise: '7:25',  sunset: '16:28'},
{date:'Jan 28', sunrise: '7:24',  sunset: '16:29'},
{date:'Jan 29', sunrise: '7:23',  sunset: '16:31'},
{date:'Jan 30', sunrise: '7:21',  sunset: '16:33'},
{date:'Jan 31', sunrise: '7:20',  sunset: '16:34'},
{date:'Feb 1', sunrise: '7:19',  sunset: '16:36'},
{date:'Feb 2', sunrise: '7:17',  sunset: '16:38'},
{date:'Feb 3', sunrise: '7:16',  sunset: '16:39'},
{date:'Feb 4', sunrise: '7:14',  sunset: '16:41'},
{date:'Feb 5', sunrise: '7:13',  sunset: '16:43'},
{date:'Feb 6', sunrise: '7:11',  sunset: '16:44'},
{date:'Feb 7', sunrise: '7:10',  sunset: '16:46'},
{date:'Feb 8', sunrise: '7:08',  sunset: '16:48'},
{date:'Feb 9', sunrise: '7:06',  sunset: '16:50'},
{date:'Feb 10', sunrise: '7:05',  sunset: '16:51'},
{date:'Feb 11', sunrise: '7:03',  sunset: '16:53'},
{date:'Feb 12', sunrise: '7:01',  sunset: '16:55'},
{date:'Feb 13', sunrise: '7:00',  sunset: '16:56'},
{date:'Feb 14', sunrise: '6:58',  sunset: '16:58'},
{date:'Feb 15', sunrise: '6:56',  sunset: '17:00'},
{date:'Feb 16', sunrise: '6:54',  sunset: '17:02'},
{date:'Feb 17', sunrise: '6:53',  sunset: '17:03'},
{date:'Feb 18', sunrise: '6:51',  sunset: '17:05'},
{date:'Feb 19', sunrise: '6:49',  sunset: '17:07'},
{date:'Feb 20', sunrise: '6:47',  sunset: '17:08'},
{date:'Feb 21', sunrise: '6:45',  sunset: '17:10'},
{date:'Feb 22', sunrise: '6:43',  sunset: '17:12'},
{date:'Feb 23', sunrise: '6:41',  sunset: '17:13'},
{date:'Feb 24', sunrise: '6:39',  sunset: '17:15'},
{date:'Feb 25', sunrise: '6:38',  sunset: '17:17'},
{date:'Feb 26', sunrise: '6:36',  sunset: '17:18'},
{date:'Feb 27', sunrise: '6:34',  sunset: '17:20'},
{date:'Feb 28', sunrise: '6:32',  sunset: '17:22'},
{date:'Mar 1', sunrise: '6:30',  sunset: '17:23'},
{date:'Mar 2', sunrise: '6:28',  sunset: '17:25'},
{date:'Mar 3', sunrise: '6:25',  sunset: '17:27'},
{date:'Mar 4', sunrise: '6:23',  sunset: '17:28'},
{date:'Mar 5', sunrise: '6:21',  sunset: '17:30'},
{date:'Mar 6', sunrise: '6:19',  sunset: '17:32'},
{date:'Mar 7', sunrise: '6:17',  sunset: '17:33'},
{date:'Mar 8', sunrise: '6:15',  sunset: '17:35'},
{date:'Mar 9', sunrise: '6:13',  sunset: '17:37'},
{date:'Mar 10', sunrise: '6:11',  sunset: '17:38'},
{date:'Mar 11', sunrise: '6:09',  sunset: '17:40'},
{date:'Mar 12', sunrise: '6:07',  sunset: '17:41'},
{date:'Mar 13', sunrise: '6:05',  sunset: '17:43'},
{date:'Mar 14', sunrise: '6:02',  sunset: '17:45'},
{date:'Mar 15', sunrise: '6:00',  sunset: '17:46'},
{date:'Mar 16', sunrise: '5:58',  sunset: '17:48'},
{date:'Mar 17', sunrise: '5:56',  sunset: '17:49'},
{date:'Mar 18', sunrise: '5:54',  sunset: '17:51'},
{date:'Mar 19', sunrise: '5:52',  sunset: '17:52'},
{date:'Mar 20', sunrise: '5:49',  sunset: '17:54'},
{date:'Mar 21', sunrise: '5:47',  sunset: '17:56'},
{date:'Mar 22', sunrise: '5:45',  sunset: '17:57'},
{date:'Mar 23', sunrise: '5:43',  sunset: '17:59'},
{date:'Mar 24', sunrise: '5:41',  sunset: '18:00'},
{date:'Mar 25', sunrise: '5:39',  sunset: '18:02'},
{date:'Mar 26', sunrise: '5:36',  sunset: '18:04'},
{date:'Mar 27', sunrise: '5:34',  sunset: '18:05'},
{date:'Mar 28', sunrise: '5:32',  sunset: '18:07'},
{date:'Mar 29', sunrise: '5:30',  sunset: '18:08'},
{date:'Mar 30', sunrise: '6:28',  sunset: '19:10'},
{date:'Mar 31', sunrise: '6:26',  sunset: '19:11'},
{date:'Apr 1', sunrise: '6:23',  sunset: '19:13'},
{date:'Apr 2', sunrise: '6:21',  sunset: '19:14'},
{date:'Apr 3', sunrise: '6:19',  sunset: '19:16'},
{date:'Apr 4', sunrise: '6:17',  sunset: '19:18'},
{date:'Apr 5', sunrise: '6:15',  sunset: '19:19'},
{date:'Apr 6', sunrise: '6:13',  sunset: '19:21'},
{date:'Apr 7', sunrise: '6:11',  sunset: '19:22'},
{date:'Apr 8', sunrise: '6:08',  sunset: '19:24'},
{date:'Apr 9', sunrise: '6:06',  sunset: '19:25'},
{date:'Apr 10', sunrise: '6:04',  sunset: '19:27'},
{date:'Apr 11', sunrise: '6:02',  sunset: '19:28'},
{date:'Apr 12', sunrise: '6:00',  sunset: '19:30'},
{date:'Apr 13', sunrise: '5:58',  sunset: '19:32'},
{date:'Apr 14', sunrise: '5:56',  sunset: '19:33'},
{date:'Apr 15', sunrise: '5:54',  sunset: '19:35'},
{date:'Apr 16', sunrise: '5:52',  sunset: '19:36'},
{date:'Apr 17', sunrise: '5:50',  sunset: '19:38'},
{date:'Apr 18', sunrise: '5:48',  sunset: '19:39'},
{date:'Apr 19', sunrise: '5:46',  sunset: '19:41'},
{date:'Apr 20', sunrise: '5:44',  sunset: '19:42'},
{date:'Apr 21', sunrise: '5:42',  sunset: '19:44'},
{date:'Apr 22', sunrise: '5:40',  sunset: '19:45'},
{date:'Apr 23', sunrise: '5:38',  sunset: '19:47'},
{date:'Apr 24', sunrise: '5:36',  sunset: '19:49'},
{date:'Apr 25', sunrise: '5:34',  sunset: '19:50'},
{date:'Apr 26', sunrise: '5:32',  sunset: '19:52'},
{date:'Apr 27', sunrise: '5:30',  sunset: '19:53'},
{date:'Apr 28', sunrise: '5:28',  sunset: '19:55'},
{date:'Apr 29', sunrise: '5:26',  sunset: '19:56'},
{date:'Apr 30', sunrise: '5:25',  sunset: '19:58'},
{date:'May 1', sunrise: '5:23',  sunset: '19:59'},
{date:'May 2', sunrise: '5:21',  sunset: '20:01'},
{date:'May 3', sunrise: '5:19',  sunset: '20:02'},
{date:'May 4', sunrise: '5:18',  sunset: '20:04'},
{date:'May 5', sunrise: '5:16',  sunset: '20:05'},
{date:'May 6', sunrise: '5:14',  sunset: '20:07'},
{date:'May 7', sunrise: '5:12',  sunset: '20:08'},
{date:'May 8', sunrise: '5:11',  sunset: '20:10'},
{date:'May 9', sunrise: '5:09',  sunset: '20:11'},
{date:'May 10', sunrise: '5:08',  sunset: '20:13'},
{date:'May 11', sunrise: '5:06',  sunset: '20:14'},
{date:'May 12', sunrise: '5:05',  sunset: '20:16'},
{date:'May 13', sunrise: '5:03',  sunset: '20:17'},
{date:'May 14', sunrise: '5:02',  sunset: '20:19'},
{date:'May 15', sunrise: '5:00',  sunset: '20:20'},
{date:'May 16', sunrise: '4:59',  sunset: '20:21'},
{date:'May 17', sunrise: '4:57',  sunset: '20:23'},
{date:'May 18', sunrise: '4:56',  sunset: '20:24'},
{date:'May 19', sunrise: '4:55',  sunset: '20:26'},
{date:'May 20', sunrise: '4:53',  sunset: '20:27'},
{date:'May 21', sunrise: '4:52',  sunset: '20:28'},
{date:'May 22', sunrise: '4:51',  sunset: '20:30'},
{date:'May 23', sunrise: '4:50',  sunset: '20:31'},
{date:'May 24', sunrise: '4:49',  sunset: '20:32'},
{date:'May 25', sunrise: '4:48',  sunset: '20:33'},
{date:'May 26', sunrise: '4:47',  sunset: '20:35'},
{date:'May 27', sunrise: '4:46',  sunset: '20:36'},
{date:'May 28', sunrise: '4:45',  sunset: '20:37'},
{date:'May 29', sunrise: '4:44',  sunset: '20:38'},
{date:'May 30', sunrise: '4:43',  sunset: '20:39'},
{date:'May 31', sunrise: '4:42',  sunset: '20:40'}];



sunset.insert(dates, function (err) {});