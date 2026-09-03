"""Add audio message support to messages table

Revision ID: 009_audio_messages
Revises: a2d4fc4303db
Create Date: 2026-09-03 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '009_audio_messages'
down_revision = 'a2d4fc4303db'
branch_labels = None
depends_on = None


def upgrade():
    """
    Add audio message fields to messages table:
    - audio_url: URL to stored audio file
    - audio_duration: Duration in seconds
    - waveform_data: JSON data for waveform visualization
    """
    # Add audio message columns
    op.add_column('messages', sa.Column('audio_url', sa.Text(), nullable=True))
    op.add_column('messages', sa.Column('audio_duration', sa.Integer(), nullable=True))
    op.add_column('messages', sa.Column('waveform_data', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    
    # Create index on audio_url for faster lookups
    op.create_index(
        'idx_messages_audio',
        'messages',
        ['audio_url'],
        unique=False,
        postgresql_where=sa.text('audio_url IS NOT NULL')
    )


def downgrade():
    """Remove audio message support"""
    # Drop index
    op.drop_index('idx_messages_audio', table_name='messages')
    
    # Drop columns
    op.drop_column('messages', 'waveform_data')
    op.drop_column('messages', 'audio_duration')
    op.drop_column('messages', 'audio_url')
