class BaseConfig(object):
    '''
    Base config class
    '''
    DEBUG = True
    TESTING = False
    ENV = 'development'

class ProductionConfig(BaseConfig):
    """
    Production specific config
    """
    DEBUG = False
    ENV='production'

class DevelopmentConfig(BaseConfig):
    """
    Development environment specific configuration
    """
    DEBUG = True
    TESTING = True
    ENV = 'development'
