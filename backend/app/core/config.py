"""
BeatPush Configuration
Loads environment variables and provides configuration settings
"""
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "BeatPush"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 9000
    
    # Database
    DATABASE_URL: str = "sqlite:///./beatspush.db"
    DATABASE_ECHO: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # JWT
    JWT_SECRET_KEY: Optional[str] = None
    JWT_ALGORITHM: str = "HS256"
    
    @validator("JWT_SECRET_KEY", always=True)
    def set_jwt_secret(cls, v, values):
        # Use SECRET_KEY as fallback for JWT_SECRET_KEY
        if v is None:
            return values.get("SECRET_KEY", "default_jwt_secret_change_in_production")
        return v
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            return [i.strip() for i in v.split(",")]
        return v
    
    # File Storage
    STORAGE_TYPE: str = "local"  # local, s3, r2
    S3_ACCESS_KEY_ID: Optional[str] = None
    S3_SECRET_ACCESS_KEY: Optional[str] = None
    S3_BUCKET_NAME: Optional[str] = None
    S3_REGION: Optional[str] = None
    S3_ENDPOINT_URL: Optional[str] = None
    
    # Cloudflare R2 Storage
    R2_ACCOUNT_ID: Optional[str] = None
    R2_ACCESS_KEY_ID: Optional[str] = None
    R2_SECRET_ACCESS_KEY: Optional[str] = None
    R2_BUCKET_AUDIO: Optional[str] = None
    R2_BUCKET_IMAGES: Optional[str] = None
    R2_BUCKET_BACKUPS: Optional[str] = None
    R2_PUBLIC_URL: Optional[str] = None
    
    # File Upload Limits
    MAX_AUDIO_FILE_SIZE_MB: int = 100
    MAX_IMAGE_FILE_SIZE_MB: int = 10
    MAX_VIDEO_FILE_SIZE_MB: int = 500
    
    # OpenAI (Optional - fallback only)
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4"
    
    # Anthropic
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # AI Configuration (Hugging Face - Free)
    HUGGINGFACE_API_URL: str = "https://api-inference.huggingface.co"
    AI_CACHE_TTL_DAYS: int = 7
    AI_FREE_TIER_DAILY_LIMIT: int = 20
    AI_RESPONSE_TIMEOUT_SECONDS: int = 10
    AI_MAX_RETRIES: int = 3
    
    # Stripe
    STRIPE_SECRET_KEY: Optional[str] = "test_mode"
    STRIPE_PUBLISHABLE_KEY: Optional[str] = "test_mode"
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    # Paystack
    PAYSTACK_SECRET_KEY: Optional[str] = None
    PAYSTACK_PUBLIC_KEY: Optional[str] = None
    PAYSTACK_WEBHOOK_SECRET: Optional[str] = None
    
    # Flutterwave
    FLUTTERWAVE_SECRET_KEY: Optional[str] = None
    FLUTTERWAVE_PUBLIC_KEY: Optional[str] = None
    
    # Email
    EMAIL_ENABLED: bool = True
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "noreply@beatpush.com"
    SMTP_PASSWORD: str = "your_smtp_password_here"
    EMAILS_FROM_EMAIL: str = "noreply@beatpush.com"
    EMAILS_FROM_NAME: str = "BeatsPush"
    
    # Spotify
    SPOTIFY_CLIENT_ID: Optional[str] = None
    SPOTIFY_CLIENT_SECRET: Optional[str] = None
    
    # YouTube
    YOUTUBE_API_KEY: Optional[str] = None
    
    # Instagram
    INSTAGRAM_APP_ID: Optional[str] = None
    INSTAGRAM_APP_SECRET: Optional[str] = None
    
    # Twitter
    TWITTER_API_KEY: Optional[str] = None
    TWITTER_API_SECRET: Optional[str] = None
    TWITTER_BEARER_TOKEN: Optional[str] = None
    
    # TikTok
    TIKTOK_CLIENT_KEY: Optional[str] = None
    TIKTOK_CLIENT_SECRET: Optional[str] = None
    
    # Sentry
    SENTRY_DSN: Optional[str] = None
    
    # Security - Cloudflare Turnstile
    TURNSTILE_SECRET_KEY: Optional[str] = None
    TURNSTILE_SITE_KEY: Optional[str] = None
    
    # Security - Termii SMS (Nigerian SMS provider)
    TERMII_API_KEY: Optional[str] = None
    TERMII_SENDER_ID: str = "BeatPush"
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # File Upload Limits (in MB)
    MAX_AUDIO_FILE_SIZE_MB: int = 200
    MAX_IMAGE_FILE_SIZE_MB: int = 10
    MAX_VIDEO_FILE_SIZE_MB: int = 500
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
