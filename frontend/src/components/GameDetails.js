import React, { Suspense } from 'react';

// MUI
import { Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Components
import LoadingIndicator from '../util/LoadingIndicator';
import BetBox from "./BetBox"
import TeamSeparator from './TeamSeparator';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { removeGameByIdAndType, openActiveBet } from '../slices/activeBetSlice';

// CSS
import "../css/GameDetails.css"



function formatDate(inputDate) {
  // Parse the input date string
  const inputDateObj = new Date(inputDate);

  // Define an array with month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Extract the date components
  const day = inputDateObj.getDate();
  const month = monthNames[inputDateObj.getMonth()];
  const hours = inputDateObj.getHours();
  const minutes = inputDateObj.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours from 24-hour format to 12-hour format
  const displayHours = hours % 12 || 12;

  // Ensure minutes are displayed with two digits
  const displayMinutes = minutes.toString().padStart(2, '0');

  // Determine the time zone (ET for Eastern Time)
  const timeZone = "ET";

  // Construct the formatted date string
  const formattedDate = `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm} ${timeZone}`;

  return formattedDate;
}

// NFL team logo URLs (replace with your preferred source or CDN)
const nflLogoUrls = {
  'San Francisco 49ers': 'https://loodibee.com/wp-content/uploads/nfl-san-francisco-49ers-team-logo-2-300x300.png',
  'Arizona Cardinals': 'https://loodibee.com/wp-content/uploads/nfl-arizona-cardinals-team-logo-2-300x300.png',
  'Atlanta Falcons': 'https://loodibee.com/wp-content/uploads/nfl-atlanta-falcons-team-logo-2-300x300.png',
  'Baltimore Ravens': 'https://loodibee.com/wp-content/uploads/nfl-baltimore-ravens-team-logo-2-300x300.png',
  'Buffalo Bills': 'https://loodibee.com/wp-content/uploads/nfl-buffalo-bills-team-logo-2-300x300.png',
  'Carolina Panthers': 'https://loodibee.com/wp-content/uploads/nfl-carolina-panthers-team-logo-2-300x300.png',
  'Chicago Bears': 'https://loodibee.com/wp-content/uploads/nfl-chicago-bears-team-logo-2-300x300.png',
  'Cincinnati Bengals': 'https://loodibee.com/wp-content/uploads/nfl-cincinnati-bengals-team-logo-2-300x300.png',
  'Cleveland Browns': 'https://loodibee.com/wp-content/uploads/nfl-cleveland-browns-team-logo-2-300x300.png',
  'Dallas Cowboys': 'https://loodibee.com/wp-content/uploads/nfl-dallas-cowboys-team-logo-2-300x300.png',
  'Denver Broncos': 'https://loodibee.com/wp-content/uploads/nfl-denver-broncos-team-logo-2-300x300.png',
  'Detroit Lions': 'https://loodibee.com/wp-content/uploads/nfl-detroit-lions-team-logo-2-300x300.png',
  'Green Bay Packers': 'https://loodibee.com/wp-content/uploads/nfl-green-bay-packers-team-logo-2-300x300.png',
  'Houston Texans': 'https://loodibee.com/wp-content/uploads/nfl-houston-texans-team-logo-2-300x300.png',
  'Indianapolis Colts': 'https://loodibee.com/wp-content/uploads/nfl-indianapolis-colts-team-logo-2-300x300.png',
  'Jacksonville Jaguars': 'https://loodibee.com/wp-content/uploads/nfl-jacksonville-jaguars-team-logo-2-300x300.png',
  'Kansas City Chiefs': 'https://loodibee.com/wp-content/uploads/nfl-kansas-city-chiefs-team-logo-2-300x300.png',
  'Los Angeles Chargers': 'https://loodibee.com/wp-content/uploads/nfl-los-angeles-chargers-team-logo-2-300x300.png',
  'Los Angeles Rams': 'https://loodibee.com/wp-content/uploads/nfl-los-angeles-rams-team-logo-2-300x300.png',
  'Las Vegas Raiders': 'https://loodibee.com/wp-content/uploads/nfl-las-vegas-raiders-team-logo-2-300x300.png',
  'Miami Dolphins': 'https://loodibee.com/wp-content/uploads/nfl-miami-dolphins-team-logo-2-300x300.png',
  'Minnesota Vikings': 'https://loodibee.com/wp-content/uploads/nfl-minnesota-vikings-team-logo-2-300x300.png',
  'New England Patriots': 'https://loodibee.com/wp-content/uploads/nfl-new-england-patriots-team-logo-2-300x300.png',
  'New Orleans Saints': 'https://loodibee.com/wp-content/uploads/nfl-new-orleans-saints-team-logo-2-300x300.png',
  'New York Giants': 'https://loodibee.com/wp-content/uploads/nfl-new-york-giants-team-logo-2-300x300.png',
  'New York Jets': 'https://loodibee.com/wp-content/uploads/nfl-new-york-jets-team-logo-2-300x300.png',
  'Philadelphia Eagles': 'https://loodibee.com/wp-content/uploads/nfl-philadelphia-eagles-team-logo-2-300x300.png',
  'Pittsburgh Steelers': 'https://loodibee.com/wp-content/uploads/nfl-pittsburgh-steelers-team-logo-2-300x300.png',
  'Seattle Seahawks': 'https://loodibee.com/wp-content/uploads/nfl-seattle-seahawks-team-logo-2-300x300.png',
  'Tampa Bay Buccaneers': 'https://loodibee.com/wp-content/uploads/nfl-tampa-bay-buccaneers-team-logo-2-300x300.png',
  'Tennessee Titans': 'https://loodibee.com/wp-content/uploads/nfl-tennessee-titans-team-logo-2-300x300.png',
  'Washington Commanders': 'https://loodibee.com/wp-content/uploads/nfl-washington-commanders-team-logo-2-300x300.png',
};

// NBA team logo URLs (replace with your preferred source or CDN)
const nbaLogoUrls = {
  'Atlanta Hawks': 'https://loodibee.com/wp-content/uploads/nba-atlanta-hawks-logo-300x300.png',
  'Brooklyn Nets': 'https://loodibee.com/wp-content/uploads/nba-brooklyn-nets-logo-300x300.png',
  'Boston Celtics': 'https://loodibee.com/wp-content/uploads/nba-boston-celtics-logo-300x300.png',
  'Charlotte Hornets': 'https://loodibee.com/wp-content/uploads/nba-charlotte-hornets-logo-300x300.png',
  'Chicago Bulls': 'https://loodibee.com/wp-content/uploads/nba-chicago-bulls-logo-300x300.png',
  'Cleveland Cavaliers': 'https://loodibee.com/wp-content/uploads/nba-cleveland-cavaliers-logo-300x300.png',
  'Dallas Mavericks': 'https://loodibee.com/wp-content/uploads/nba-dallas-mavericks-logo-300x300.png',
  'Denver Nuggets': 'https://loodibee.com/wp-content/uploads/nba-denver-nuggets-logo-300x300.png',
  'Detroit Pistons': 'https://loodibee.com/wp-content/uploads/nba-detroit-pistons-logo-300x300.png',
  'Golden State Warriors': 'https://loodibee.com/wp-content/uploads/nba-golden-state-warriors-logo-300x300.png',
  'Houston Rockets': 'https://loodibee.com/wp-content/uploads/nba-houston-rockets-logo-300x300.png',
  'Indiana Pacers': 'https://loodibee.com/wp-content/uploads/nba-indiana-pacers-logo-300x300.png',
  'Los Angeles Clippers': 'https://loodibee.com/wp-content/uploads/nba-la-clippers-logo-300x300.png',
  'Los Angeles Lakers': 'https://loodibee.com/wp-content/uploads/nba-la-lakers-logo-300x300.png',
  'Memphis Grizzlies': 'https://loodibee.com/wp-content/uploads/nba-memphis-grizzlies-logo-300x300.png',
  'Miami Heat': 'https://loodibee.com/wp-content/uploads/nba-miami-heat-logo-300x300.png',
  'Milwaukee Bucks': 'https://loodibee.com/wp-content/uploads/nba-milwaukee-bucks-logo-300x300.png',
  'Minnesota Timberwolves': 'https://loodibee.com/wp-content/uploads/nba-minnesota-timberwolves-logo-300x300.png',
  'New Orleans Pelicans': 'https://loodibee.com/wp-content/uploads/nba-new-orleans-pelicans-logo-300x300.png',
  'New York Knicks': 'https://loodibee.com/wp-content/uploads/nba-new-york-knicks-logo-300x300.png',
  'Oklahoma City Thunder': 'https://loodibee.com/wp-content/uploads/nba-oklahoma-city-thunder-logo-300x300.png',
  'Orlando Magic': 'https://loodibee.com/wp-content/uploads/nba-orlando-magic-logo-300x300.png',
  'Philadelphia 76ers': 'https://loodibee.com/wp-content/uploads/nba-philadelphia-76ers-logo-300x300.png',
  'Phoenix Suns': 'https://loodibee.com/wp-content/uploads/nba-phoenix-suns-logo-300x300.png',
  'Portland Trail Blazers': 'https://loodibee.com/wp-content/uploads/nba-portland-trail-blazers-logo-300x300.png',
  'Sacramento Kings': 'https://loodibee.com/wp-content/uploads/nba-sacramento-kings-logo-300x300.png',
  'San Antonio Spurs': 'https://loodibee.com/wp-content/uploads/nba-san-antonio-spurs-logo-300x300.png',
  'Toronto Raptors': 'https://loodibee.com/wp-content/uploads/nba-toronto-raptors-logo-300x300.png',
  'Utah Jazz': 'https://loodibee.com/wp-content/uploads/nba-utah-jazz-logo-300x300.png',
  'Washington Wizards': 'https://loodibee.com/wp-content/uploads/nba-washington-wizards-logo-300x300.png',
};


function TeamComponent({ teamName }) {
  // NFL teams use nflLogoUrls, NBA teams use nbaLogoUrls
  if (nflLogoUrls[teamName]) {
    return <img src={nflLogoUrls[teamName]} alt={teamName + ' logo'} style={{ width: 50, height: 50 }} />;
  } else if (nbaLogoUrls[teamName]) {
    return <img src={nbaLogoUrls[teamName]} alt={teamName + ' logo'} style={{ width: 50, height: 50 }} />;
  } else {
    return <div>Invalid team name</div>;
  }
}

const TeamName = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '1.2em',
    color: '#ffffff',
})

const getSpreadColor = (spread) => (spread > 0 ? "green" : "red");


const StyledGridContainer = styled(Grid)({
  display: 'flex',
  flexWrap: 'wrap',
});

const StyledBetBox = styled(BetBox)({
  color: '#ffffff',
  border: '2px solid #E0E0E0',
  borderRadius: '5px',  // Adjusted to match your image
  width: '50px',
  height: '80px',
  flexDirection: 'column',  // Stack content vertically
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px',
});

const LogoContainer = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',  // Space between logos
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: '50px',
});

const NameContainer = styled(Grid)({
  minWidth: '300px',
  display: 'flex',
  flexDirection: 'column',
  gap: '70px',  // Space between names
  justifyContent: 'center',
  alignItems: 'center'
});

const BetOptionsContainer = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',  // Space between TeamBetContainers
  alignContent: 'center',
  justifyContent: 'center',
});

const TeamBetContainer = styled(Grid)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
});

const BottomContainer = styled(Grid)({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  gap: '0px',
  justifyContent: 'start',
  color: '#ffffff',
  marginLeft: '1%',
  fontSize: '0.85em'
});

const DateContainer = styled(Grid)({
  display: 'flex',
  flexDirection: 'row',
  gap: '0px',
  justifyContent: 'start',
  alignItems: 'flex-end',
  color: '#ffffff',
  marginLeft: '1%',
  marginBottom: '2%',
  fontWeight: '100',
  fontSize: '1em',
  flexWrap: 'wrap'
});

const BestBetContainer = styled(Grid)({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  gap: '0px',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#ffffff',
  marginLeft: '31.5%',
  fontWeight: '150',
  marginRight: '2%',
  marginBottom: '2%',
  width: '175px'
});

const BestBetButton = styled(Button)(({ isClicked }) => ({
  fontSize: '1em',
  color: 'green',
  border: '2px solid',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '2px',
  paddingBottom: '8px',
  paddingTop: '8px',
  width: '124px',
  maxHeight: '70px',
  backgroundColor: isClicked ? 'green' : 'transparent', // TODO: Implement isClicked state
  '&:hover': {
      backgroundColor: 'green',
      color: 'white'
  },
}));

const BestBetText = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '1.2em',
  color: '#ffffff',
  alignText: 'center',
  justifyContent: 'center'
})

const EdgeText = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '1.2em',
  color: '#008001',
  alignText: 'center',
  justifyContent: 'center'
})

const WordsContainer = styled(Grid)({
  display: 'flex',
  alignText: 'center',
  justifyContent: 'space-between',
  flexGrow: 1,
  flexDirection: 'row',
  paddingRight: '6%'
})

const LogoDateContainer = styled(Grid)({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'nowrap',
  flexDirection: 'row',
  width: '25%',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  paddingBottom: '1%',
  paddingLeft: '1%'
})

const GameDetails = ({ game }) => {
    // Destructure game properties
    const {
        date,
        sport,
        away_team,
        home_team,
        away_odds,
        home_odds,
        away_spread,
        away_spread_odds,
        home_spread,
        home_spread_odds,
        total,
        over_odds,
        under_odds,
        best_bet_type,
        best_bet_edge
    } = game;

    const dispatch = useDispatch();
    const bets = useSelector((state) => state.activeBets.bets);
    const hasActiveBets = useSelector((state) => state.activeBets.hasActiveBets)

    const handleBestBetClick = ({bet_type, game}) => {
      // console.log("best bet type: ", bet_type, " and game: ", game);

      const betExists = bets.find(bet => bet.game.game_id === game.game_id && bet.bet_type === bet_type) ? true : false;
  
      // console.log(betExists)
  
      if (betExists) {
        dispatch(removeGameByIdAndType({game_id: game.game_id, bet_type: bet_type}))
      } else {
        dispatch(openActiveBet({bet_type: bet_type, game: game}))  
      }
  
    }

    function getBestBet(b) {
      let name = ""
            if (b === "Home") {
                name = home_team + " Money Line"
            } else if (b === "Away") {
                name = away_team + " Money Line"
            } else if (b === "Home Line") {
                if (home_spread > 0){
                  name = home_team + " +" + home_spread
                } else {
                name = home_team + " " + home_spread
                }
            } else if (b === "Away Line") {
              if (away_spread > 0){
                name = away_team + " +" + away_spread
              } else {
              name = away_team + " " + away_spread
              }
            } else if (b === "Over") {
                name =  "Over " + total
            } else if (b === "Under") {
                name =  "Under " + total
            }   
            return name
    }

    function convertBackToOriginalBetType(betTypeName) {
      switch (betTypeName) {
          case "Home":
              return "moneyline_home";
          case "Away":
              return "moneyline_away";
          case "Home Line":
              return "home_spread";
          case "Away Line":
              return "away_spread";
          case "Over":
              return "total_over";
          case "Under":
              return "total_under";
          default:
              return "Unknown Bet Type";
      }
  }

    const bb = getBestBet(best_bet_type);
    const new_date = formatDate(date);

    return (
      <StyledGridContainer container spacing={0} alignItems="center" justifyContent="center" style={{borderBottom: '1px solid #2f2d2f'}}>
        <TeamSeparator />
        <LogoContainer>
          <TeamComponent teamName={away_team} />
          <TeamComponent teamName={home_team} />
        </LogoContainer>

        <NameContainer>
          <TeamName variant="h6">{away_team}</TeamName>
          <TeamName variant="h6">{home_team}</TeamName>
        </NameContainer>

        <BetOptionsContainer>
          <TeamBetContainer>
            <StyledBetBox bet_type={'away_spread'} away_spread={away_spread} away_spread_odds={away_spread_odds} game={game}/>
            <StyledBetBox bet_type={'moneyline_away'} away_odds={away_odds} game={game}/>
            <StyledBetBox bet_type={'total_over'} total={total} over_odds={over_odds} game={game}/>
          </TeamBetContainer>

          <TeamBetContainer>
            <StyledBetBox bet_type={'home_spread'} home_spread={home_spread} home_spread_odds={home_spread_odds} color={getSpreadColor(home_spread)} game={game}/>
            <StyledBetBox bet_type={'moneyline_home'} home_odds={home_odds} game={game}/>
            <StyledBetBox bet_type={'total_under'} total={total} under_odds={under_odds} game={game}/>
          </TeamBetContainer>
        </BetOptionsContainer>
        <BottomContainer>
          <LogoDateContainer>
          {sport === 'nfl' ? (
            <img
              src={'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/National_Football_League_logo.svg/1200px-National_Football_League_logo.svg.png'}
              className="list-item-image"
            />
          ) : (
            <img
              src={'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/National_Basketball_Association_logo.svg/105px-National_Basketball_Association_logo.svg.png'}
              className="list-item-image"
            />
          )}
              <DateContainer>{new_date}</DateContainer>
          </LogoDateContainer>
          <BestBetContainer>
              <WordsContainer>
                <EdgeText> {best_bet_edge} Point Edge </EdgeText>
                <BestBetText> Best Bet: </BestBetText>
              </WordsContainer>
              <BestBetButton onClick={() => handleBestBetClick({bet_type: convertBackToOriginalBetType(best_bet_type), game: game})}>{bb}</BestBetButton>
          </BestBetContainer>
        </BottomContainer>
      </StyledGridContainer>
    )
}

export default GameDetails;
