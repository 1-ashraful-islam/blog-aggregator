package scrapper

import (
	"context"
	"database/sql"
	"encoding/xml"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/1-ashraful-islam/blog-aggregator/internal/database"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

type Rss struct {
	Channel struct {
		Title         string `xml:"title"`
		Link          string `xml:"link"`
		Description   string `xml:"description"`
		LastBuildDate string `xml:"lastBuildDate"`
		Items         []struct {
			Title       string `xml:"title"`
			Link        string `xml:"link"`
			PubDate     string `xml:"pubDate"`
			Description string `xml:"description"`
		} `xml:"item"`
	} `xml:"channel"`
}

type FeedInfo struct {
	Title       string
	Description string
}

func ScrapeFeed(ctx context.Context, db *database.Queries, feed database.Feed) error {
	// Scrape the feed
	// Save the feed to the database
	fmt.Println("Scraping feed", feed.Url)

	body, err := fetchURL(feed.Url)
	if err != nil {
		return errors.Wrap(err, "fetching feed failed for "+feed.Url)
	}

	feedData := &Rss{}

	if err := xml.Unmarshal(body, &feedData); err != nil || len(feedData.Channel.Items) == 0 {
		return errors.Wrap(err, "parsing feed failed for "+feed.Url)
	}

	// update the last fetched at time
	_, err = db.MarkFeedAsFetched(ctx, database.MarkFeedAsFetchedParams{
		ID: feed.ID,
		LastFetchedAt: sql.NullTime{
			Time:  time.Now(),
			Valid: true,
		},
		UpdatedAt: time.Now(),
	})
	if err != nil {
		return errors.Wrap(err, "updating feed to the database for "+feed.Url)
	}

	for _, item := range feedData.Channel.Items {

		// Check if the post already exists
		if _, err := db.GetPostByURL(ctx, item.Link); err == nil {
			continue
		}
		parsedTime, err := parseTime(item.PubDate)
		if err != nil {
			return errors.Wrap(err, "parsing published time failed for "+feed.Url)
		}

		_, err = db.CreatePost(ctx, database.CreatePostParams{
			ID:          uuid.New(),
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
			FeedID:      feed.ID,
			Title:       item.Title,
			Url:         item.Link,
			Description: item.Description,
			PublishDate: parsedTime,
		})
		if err != nil {
			return errors.Wrap(err, "creating post to the database for "+feed.Url)
		}
	}
	log.Println("Scraped feed", feed.Url, "with", len(feedData.Channel.Items), "items")

	return nil
}

func FetchFeedInfo(ctx context.Context, url string) (*FeedInfo, error) {
	body, err := fetchURL(url)
	if err != nil {
		return nil, errors.Wrap(err, "fetching feed info failed for "+url)
	}

	feedData := &Rss{}
	if err := xml.Unmarshal(body, &feedData); err != nil {
		return nil, errors.Wrap(err, "parsing feed info failed for "+url)
	}
	log.Println("Fetched feed info", feedData.Channel.Title, "from", url)
	feedInfo := &FeedInfo{
		Title:       feedData.Channel.Title,
		Description: feedData.Channel.Description,
	}
	return feedInfo, nil
}

func fetchURL(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	return io.ReadAll(resp.Body)
}

func parseTime(s string) (time.Time, error) {
	var formats = []string{time.RFC1123Z, time.RFC1123}
	var parsedTime time.Time
	var err error

	for _, format := range formats {
		parsedTime, err = time.Parse(format, s)
		if err == nil {
			break
		}
	}

	if err != nil {
		return time.Time{}, errors.Wrap(err, " expected formats: "+strings.Join(formats, ", ")+" got: "+s)
	}
	return parsedTime, nil
}
