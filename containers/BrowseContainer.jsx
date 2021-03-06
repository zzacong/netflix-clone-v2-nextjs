import { useEffect, useState } from 'react'
import Fuse from 'fuse.js'
import { Card, Header, Loading, Player } from '../components'
import { useAuth } from '../hooks'
import { FooterContainer } from './FooterContainer'
import SelectProfilesContainer from './ProfilesContainer'

export default function BrowseContainer({ slides }) {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('series')
  const [slideRows, setSlideRows] = useState([])

  useEffect(() => {
    const t1 = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(t1)
  }, [profile.displayName])

  useEffect(() => {
    setSlideRows(slides[category])
  }, [slides, category])

  useEffect(() => {
    const fuse = new Fuse(slideRows, {
      keys: ['data.description', 'data.title', 'data.genre'],
    })
    const results = fuse.search(searchTerm).map(({ item }) => item)

    if (slideRows.length > 0 && searchTerm.length > 3 && results.length)
      setSlideRows(results)
    else setSlideRows(slides[category])
  }, [searchTerm])

  return profile.displayName ? (
    <>
      {loading ? <Loading src={user?.photoURL} /> : <Loading.ReleaseBody />}
      <Header src="joker1" hideOnSmallViewPort>
        <Header.Frame>
          <Header.Group>
            <Header.Logo href="/" alt="Netflix" src="/logo.svg" />
            <Header.TextLink
              active={category === 'series'}
              onClick={() => setCategory('series')}
            >
              Series
            </Header.TextLink>
            <Header.TextLink
              active={category === 'films'}
              onClick={() => setCategory('films')}
            >
              Films
            </Header.TextLink>
          </Header.Group>

          <Header.Group>
            <Header.Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <Header.Profile>
              <Header.Picture src={user.photoURL} />
              <Header.Dropdown>
                <Header.Group>
                  <Header.Picture src={user.photoURL} />
                  <Header.TextLink>{user.displayName}</Header.TextLink>
                </Header.Group>

                <Header.Group>
                  <Header.TextLink onClick={signOut}>
                    Sign out of Netflix
                  </Header.TextLink>
                </Header.Group>
              </Header.Dropdown>
            </Header.Profile>
          </Header.Group>
        </Header.Frame>

        <Header.Feature>
          <Header.FeatureCallOut>Watch Joker Now</Header.FeatureCallOut>
          <Header.Text>
            Forever alone in a crowd, failed comedian Arthur Fleck seeks
            connection as he walks the streets of Gotham City. Arthur wears two
            masks -- the one he paints for his day job as a clown, and the guise
            he projects in a futile attempt to feel like he's part of the world
            around him.
          </Header.Text>
          <Header.Group>
            <Header.PlayButton>Play</Header.PlayButton>
            <Header.InfoButton>More Info</Header.InfoButton>
          </Header.Group>
        </Header.Feature>
      </Header>

      <Card.Group>
        {slideRows.map(slideItem => (
          <Card key={`${category}-${slideItem.title.toLowerCase()}`}>
            <Card.Title>{slideItem.title}</Card.Title>
            <Card.Entities>
              {slideItem.data.map(item => (
                <Card.Item key={item.docId} item={item}>
                  <Card.Image
                    src={`/images/${category}/${item.genre}/${item.slug}/small.jpg`}
                  />
                  <Card.Meta>
                    <Card.Subtitle>{item.title}</Card.Subtitle>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Meta>
                </Card.Item>
              ))}
            </Card.Entities>
            <Card.Feature category={category}>
              <Player>
                <Player.Button />
                <Player.Video src="/videos/bunny.mp4" />
              </Player>
            </Card.Feature>
          </Card>
        ))}
      </Card.Group>
      <FooterContainer />
    </>
  ) : (
    <SelectProfilesContainer
      user={user}
      profile={profile}
      setProfile={setProfile}
    />
  )
}
